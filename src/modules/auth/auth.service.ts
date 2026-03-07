import { randomUUID } from 'crypto';

import { inject, injectable } from 'inversify';

import { PasswordHashAdapter } from '../../core/adapters';
import { convertUnixTimeToDate } from '../../core/utils';
import { UserDeviceSessionsService } from '../user-device-session/user-device-session.service';
import { UserDeviceSessionsRepository } from '../user-device-session/user-device-sessions.repository';
import { UserModel } from '../users/user.model';
import { UsersRepository } from '../users/users.repository';

import { AuthTokenAdapter } from './adapters/auth-token.adapter';
import { EmailRegistrationAdapter } from './adapters/email-registration.adapter';
import { LoginDTO } from './dto/login.dto';
import { NewPasswordDTO } from './dto/new-password.dto';
import { PasswordRecoveryDTO } from './dto/password-recovery.dto';
import { RegistrationEmailResendingDTO } from './dto/registration-email-resending.dto';
import { RegistrationDTO } from './dto/registration.dto';
import { authObjectResult } from './utils/auth-object-result';

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

  async login(args: LoginDTO) {
    const { ip, deviceName, loginOrEmail, password } = args;

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

    if (!user.checkIsConfirmed()) {
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
      ip,
      deviceName,
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

    const userDevicesSessionDocument = session.updateUserDeviceSession({
      ip,
      iat: convertUnixTimeToDate(iat),
      expirationAt: convertUnixTimeToDate(exp),
    });

    await this.userDeviceSessionsRepository.saveSession(userDevicesSessionDocument);

    return authObjectResult.success({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  async registration(credentials: RegistrationDTO) {
    const { login, email, password } = credentials;

    const result = await UserModel.checkIsUserExist(credentials);

    if (result.isExist) {
      return authObjectResult.registrationInvalidCredentials(result.byField);
    }

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(password);

    const { userDocument, confirmationCode } = await UserModel.createUnconfirmedUserInstance({
      login,
      email,
      passwordHash,
    });

    this.emailRegistrationAdapter
      .sendConfirmationCode({ email, code: confirmationCode })
      .catch(err => console.log(err));

    return authObjectResult.success(userDocument._id.toString());
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (user.checkIsConfirmed()) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (user.checkIsConfirmationExpired()) {
      return authObjectResult.invalidConfirmationCode();
    }

    const userDocument = user.confirmUser();

    await this.usersRepository.saveUser(userDocument);

    return authObjectResult.success();
  }

  async registrationEmailResending(credentials: RegistrationEmailResendingDTO) {
    const user = await this.usersRepository.getUserByLoginOrEmail(credentials.email);

    if (!user) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    if (user.checkIsConfirmed()) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    const userDocument = user.updateUserConfirmationData();

    await this.usersRepository.saveUser(user);

    this.emailRegistrationAdapter
      .resendConfirmationCode({
        email: credentials.email,
        code: userDocument.emailConfirmation.confirmationCode,
      })
      .catch(err => console.log(err));

    return authObjectResult.success();
  }

  async passwordRecovery(credentials: PasswordRecoveryDTO) {
    const user = await this.usersRepository.getUserByLoginOrEmail(credentials.email);

    if (user) {
      const userDocument = user.setPasswordRecoveryData();

      await this.usersRepository.saveUser(userDocument);

      this.emailRegistrationAdapter
        .sendPasswordRecoveryCode({
          email: credentials.email,
          code: userDocument.passwordRecovery!.recoveryCode,
        })
        .catch(err => console.log(err));
    }

    return authObjectResult.success();
  }

  async createNewPassword(credentials: NewPasswordDTO) {
    const { newPassword, recoveryCode } = credentials;

    const user = await this.usersRepository.getUserByRecoveryCode(recoveryCode);

    if (!user || !user.checkIsRecoveryPasswordExist()) {
      return authObjectResult.invalidRecoveryCode();
    }

    if (user.checkIsRecoveryPasswordExpired()) {
      return authObjectResult.invalidRecoveryCode();
    }

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(newPassword);

    const userDocument = user.updateUserPassword(passwordHash);

    await this.usersRepository.saveUser(userDocument);

    return authObjectResult.success();
  }
}
