import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { RequestWithBodyType, HTTP_STATUSES } from '../../core/types';
import { getRequestIp, RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';
import { UserDeviceSessionsService } from '../../sessions/application';
import { UsersQueryRepository } from '../../users/repository';
import { AuthService } from '../application';
import {
  LoginInputType,
  NewPasswordInputType,
  PasswordRecoveryType,
  RegistrationConfirmationInputType,
  RegistrationEmailResendingType,
  RegistrationInputType,
} from '../types';

const FALLBACK_DEVICE_NAME = 'Unknown Device';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(UsersQueryRepository) private usersQWRepository: UsersQueryRepository,
    @inject(UserDeviceSessionsService) private userDeviceSessionsService: UserDeviceSessionsService
  ) {}

  async login(req: RequestWithBodyType<LoginInputType>, res: Response) {
    const deviceName = req.headers['user-agent'] ?? FALLBACK_DEVICE_NAME;
    const ip = getRequestIp(req);

    const result = await this.authService.login({ ip, deviceName, credentials: req.body });

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.cookie('refreshToken', result.data?.refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUSES.OK).send({ accessToken: result.data!.accessToken });
  }

  async logout(req: RequestWithBodyType<LoginInputType>, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    await this.userDeviceSessionsService.deleteUserSessionByRefreshToken(refreshToken);

    res.clearCookie('refreshToken', { path: '/' });
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async me(req: Request, res: Response) {
    const userId = req.userId;

    const user = userId ? await this.usersQWRepository.getMeUserById(userId) : null;

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }

    res.status(HTTP_STATUSES.OK).send(user);
  }

  async refreshToken(req: RequestWithBodyType<RegistrationInputType>, res: Response) {
    const refreshToken = req.cookies.refreshToken as string;
    const ip = getRequestIp(req);

    const result = await this.authService.refreshToken({ ip, refreshToken });

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.cookie('refreshToken', result.data?.refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUSES.OK).send({ accessToken: result.data!.accessToken });
  }

  async registration(req: RequestWithBodyType<RegistrationInputType>, res: Response) {
    const result = await this.authService.registration(req.body);

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async registrationConfirmation(
    req: RequestWithBodyType<RegistrationConfirmationInputType>,
    res: Response
  ) {
    const result = await this.authService.registrationConfirmation(req.body.code);

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async registrationEmailResending(
    req: RequestWithBodyType<RegistrationEmailResendingType>,
    res: Response
  ) {
    const result = await this.authService.registrationEmailResending(req.body);

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async recoveryPassword(req: RequestWithBodyType<PasswordRecoveryType>, res: Response) {
    await this.authService.passwordRecovery(req.body);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async createNewPassword(req: RequestWithBodyType<NewPasswordInputType>, res: Response) {
    const result = await this.authService.createNewPassword(req.body);

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }
}
