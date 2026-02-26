import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { AuthTokenAdapter } from '../../auth/adapters';
import { HTTP_STATUSES, RequestWithUriParamType } from '../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';
import { UserDeviceSessionsQueryRepository } from '../repository';

import { UserDeviceSessionsService } from './../application/user-device-session.service';

@injectable()
export class UserDeviceSessionsController {
  constructor(
    @inject(AuthTokenAdapter) private authTokenAdapter: AuthTokenAdapter,
    @inject(UserDeviceSessionsQueryRepository)
    private userDeviceSessionsQueryRepository: UserDeviceSessionsQueryRepository,
    @inject(UserDeviceSessionsService)
    private userDeviceSessionsService: UserDeviceSessionsService
  ) {}

  async getDeviceSessions(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const decodedRefreshToken = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const usersSessionsViewModel =
      await this.userDeviceSessionsQueryRepository.getUserSessionsForUserById(
        decodedRefreshToken.userId
      );

    res.status(HTTP_STATUSES.OK).send(usersSessionsViewModel);
  }

  async deleteDevicesSessions(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken as string;

    await this.userDeviceSessionsService.deleteUserSessionsExceptTheCurrent(refreshToken);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async deleteDeviceSessionById(req: RequestWithUriParamType, res: Response) {
    const deviceId = req.params.id;
    const refreshToken = req.cookies.refreshToken;

    const result = await this.userDeviceSessionsService.deleteUserSessionByDeviceId({
      deviceId,
      refreshToken,
    });

    if (result.status !== RESULT_STATUSES.OK) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }
}
