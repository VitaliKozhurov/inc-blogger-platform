import { randomUUID } from 'crypto';

import { add } from 'date-fns/add';
import { inject, injectable } from 'inversify';

import { PasswordHashAdapter } from '../../core/adapters';
import { convertUnixTimeToDate } from '../../core/utils';
import { UserDeviceSessionsService } from '../../sessions/application';
import { UserDeviceSessionsRepository } from '../../sessions/repository';
import { UsersRepository } from '../../users/repository';
import { AuthTokenAdapter, EmailRegistrationAdapter } from '../adapters';
import {
  LoginInputType,
  NewPasswordInputType,
  PasswordRecoveryType,
  RegistrationEmailResendingType,
  RegistrationInputType,
} from '../types';
import { authObjectResult } from '../utils/auth-object-result';

type LoginArgs = {
  ip: string;
  deviceName: string;
  credentials: LoginInputType;
};

type RefreshTokenArgs = { ip: string; refreshToken: string };

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) protected usersRepository: UsersRepository,
    @inject(AuthTokenAdapter) protected authTokenAdapter: AuthTokenAdapter,
    @inject(EmailRegistrationAdapter) protected emailRegistrationAdapter: EmailRegistrationAdapter,
    @inject(PasswordHashAdapter) protected passwordHashAdapter: PasswordHashAdapter,
    @inject(UserDeviceSessionsService)
    protected userDeviceSessionService: UserDeviceSessionsService,
    @inject(UserDeviceSessionsRepository)
    protected userDeviceSessionsRepository: UserDeviceSessionsRepository
  ) {}

  async login({ credentials, ...restArgs }: LoginArgs) {
    const { loginOrEmail, password } = credentials;

    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return authObjectResult.invalidCredentials();
    }

    const isVerified = await this.passwordHashAdapter.verifyPassword({
      password,
      hash: user.passwordHash,
    });

    if (!isVerified) {
      return authObjectResult.invalidCredentials();
    }

    if (!user.emailConfirmation.isConfirmed) {
      return authObjectResult.emailNotVerified();
    }

    const userId = user._id.toString();
    const deviceId = randomUUID();

    const accessToken = this.authTokenAdapter.createAccessToken({ userId });
    const refreshToken = this.authTokenAdapter.createRefreshToken({ userId, deviceId });

    await this.userDeviceSessionService.createSession({
      userId,
      refreshToken,
      deviceId,
      ...restArgs,
    });

    return authObjectResult.success({ accessToken, refreshToken });
  }

  async refreshToken({ ip, refreshToken }: RefreshTokenArgs) {
    const tokenResult = this.authTokenAdapter.decodeRefreshToken(refreshToken);

    if (!tokenResult) {
      return authObjectResult.invalidCredentials();
    }

    const user = await this.usersRepository.getUserById(tokenResult.userId);

    if (!user) {
      return authObjectResult.invalidCredentials();
    }

    const session = await this.userDeviceSessionsRepository.getSessionByFilter({
      deviceId: tokenResult.deviceId,
      iat: convertUnixTimeToDate(tokenResult.iat),
    });

    if (!session) {
      return authObjectResult.notFoundSession();
    }

    const userId = user._id.toString();

    const newAccessToken = this.authTokenAdapter.createAccessToken({ userId });
    const newRefreshToken = this.authTokenAdapter.createRefreshToken({
      userId,
      deviceId: tokenResult.deviceId,
    });

    const { iat, exp } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    session.ip = ip;
    session.iat = convertUnixTimeToDate(iat);
    session.expirationAt = convertUnixTimeToDate(exp);

    await this.userDeviceSessionsRepository.saveSession(session);

    return authObjectResult.success({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  async registration(credentials: RegistrationInputType) {
    const { login, email, password } = credentials;

    const [useByLogin, userByEmail] = await Promise.all([
      this.usersRepository.getUserByLoginOrEmail(login),
      this.usersRepository.getUserByLoginOrEmail(email),
    ]);

    if (useByLogin) {
      return authObjectResult.registrationInvalidCredentials('login');
    }

    if (userByEmail) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(password);

    const confirmationCode = randomUUID();

    const newUser = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }),
      },
    };

    const userId = await this.usersRepository.createUser(newUser);

    this.emailRegistrationAdapter
      .sendConfirmationCode({ email, code: confirmationCode })
      .catch(err => console.log(err));

    return authObjectResult.success(userId);
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (user.emailConfirmation.isConfirmed) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (
      user.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date()
    ) {
      return authObjectResult.invalidConfirmationCode();
    }

    user.emailConfirmation = { isConfirmed: true, confirmationCode: '', expirationDate: null };

    await this.usersRepository.saveUser(user);

    return authObjectResult.success();
  }

  async registrationEmailResending(credentials: RegistrationEmailResendingType) {
    const user = await this.usersRepository.getUserByLoginOrEmail(credentials.email);

    if (!user) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    if (user.emailConfirmation.isConfirmed) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    const confirmationCode = randomUUID();

    user.emailConfirmation = {
      isConfirmed: false,
      confirmationCode,
      expirationDate: add(new Date(), { hours: 1 }),
    };

    await this.usersRepository.saveUser(user);

    this.emailRegistrationAdapter
      .resendConfirmationCode({
        email: credentials.email,
        code: confirmationCode,
      })
      .catch(err => console.log(err));

    return authObjectResult.success();
  }

  async passwordRecovery(credentials: PasswordRecoveryType) {
    const user = await this.usersRepository.getUserByLoginOrEmail(credentials.email);

    if (user) {
      const recoveryCode = randomUUID();

      user.passwordRecovery = {
        recoveryCode,
        expirationDate: add(new Date(), { hours: 1 }),
      };

      await this.usersRepository.saveUser(user);

      this.emailRegistrationAdapter
        .sendPasswordRecoveryCode({
          email: credentials.email,
          code: recoveryCode,
        })
        .catch(err => console.log(err));
    }

    return authObjectResult.success();
  }

  async createNewPassword(credentials: NewPasswordInputType) {
    const { newPassword, recoveryCode } = credentials;

    const user = await this.usersRepository.getUserByRecoveryCode(recoveryCode);

    if (!user || !user.passwordRecovery) {
      return authObjectResult.invalidRecoveryCode();
    }

    if (user.passwordRecovery.expirationDate && user.passwordRecovery.expirationDate < new Date()) {
      return authObjectResult.invalidRecoveryCode();
    }

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(newPassword);

    user.passwordHash = passwordHash;

    await this.usersRepository.saveUser(user);

    return authObjectResult.success();
  }
}
