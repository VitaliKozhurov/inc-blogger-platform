import { randomUUID } from 'crypto';

import { add } from 'date-fns/add';
import { inject, injectable } from 'inversify';

import { PasswordHashAdapter } from '../../core/adapters';
import { UserDeviceSessionsService } from '../../sessions/application';
import { UsersRepository } from '../../users/repository';
import { UserDBType } from '../../users/types';
import { AuthTokenAdapter, EmailRegistrationAdapter } from '../adapters';
import {
  LoginInputType,
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
    @inject(UserDeviceSessionsService) protected userDeviceSessionService: UserDeviceSessionsService
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

    await this.userDeviceSessionService.saveUserSession({
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

    const userId = user._id.toString();
    const deviceId = tokenResult.deviceId;
    const prevIat = tokenResult.iat;

    const newAccessToken = this.authTokenAdapter.createAccessToken({ userId });
    const newRefreshToken = this.authTokenAdapter.createRefreshToken({ userId, deviceId });

    const isUpdated = await this.userDeviceSessionService.updateUserSession({
      prevIat,
      ip,
      refreshToken: newRefreshToken,
    });

    if (!isUpdated) {
      return authObjectResult.invalidRefreshToken();
    }

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

    const newUser: UserDBType = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
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

    if (new Date(user.emailConfirmation.expirationDate) < new Date()) {
      return authObjectResult.invalidConfirmationCode();
    }

    const userData = {
      ...user,
      emailConfirmation: { isConfirmed: true, confirmationCode: '', expirationDate: '' },
    };

    await this.usersRepository.updateUserById({ id: user._id.toString(), userData });

    return authObjectResult.success();
  }

  async registrationEmailResending(credentials: RegistrationEmailResendingType) {
    const userByEmail = await this.usersRepository.getUserByLoginOrEmail(credentials.email);

    if (!userByEmail) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    if (userByEmail.emailConfirmation.isConfirmed) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    const confirmationCode = randomUUID();

    const userData = {
      ...userByEmail,
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
      },
    };

    await this.usersRepository.updateUserById({ id: userByEmail._id.toString(), userData });

    this.emailRegistrationAdapter
      .resendConfirmationCode({
        email: credentials.email,
        code: confirmationCode,
      })
      .catch(err => console.log(err));

    return authObjectResult.success();
  }

  async passwordRecovery(credentials: PasswordRecoveryType) {}
}
