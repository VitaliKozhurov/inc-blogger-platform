import { inject, injectable } from 'inversify';

import { AuthTokenAdapter } from '../../auth/adapters';
import { convertUnixTimeToDate } from '../../core/utils';
import { UserDeviceSessionsRepository } from '../repository';
import { sessionObjectResult } from '../utils/session-object-result';

type SaveSessionArgs = {
  refreshToken: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
};

@injectable()
export class UserDeviceSessionsService {
  constructor(
    @inject(AuthTokenAdapter) private authTokenAdapter: AuthTokenAdapter,
    @inject(UserDeviceSessionsRepository)
    private userDeviceSessionsRepository: UserDeviceSessionsRepository
  ) {}

  async createSession(args: SaveSessionArgs) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const { iat, exp } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const userSessionData = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat: convertUnixTimeToDate(iat),
      expirationAt: convertUnixTimeToDate(exp),
    };

    const id = await this.userDeviceSessionsRepository.createSession(userSessionData);

    return sessionObjectResult.success(id);
  }

  async deleteSessionsExceptTheCurrent(refreshToken: string) {
    const { deviceId } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await this.userDeviceSessionsRepository.deleteSessionsExceptTheCurrent({ deviceId });

    return sessionObjectResult.success();
  }

  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const { deviceId } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const isDeleted = await this.userDeviceSessionsRepository.deleteSessionByDeviceId(deviceId);

    if (isDeleted) {
      return sessionObjectResult.success();
    }

    return sessionObjectResult.notFoundSession();
  }

  async deleteSessionByDeviceId({
    deviceId,
    refreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
  }) {
    const decodedToken = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const sessionForDeleting = await this.userDeviceSessionsRepository.getSessionByFilter({
      deviceId,
    });

    if (!sessionForDeleting) {
      return sessionObjectResult.notFoundSession();
    }

    const isForeignSession = sessionForDeleting.userId !== decodedToken.userId;

    if (isForeignSession) {
      return sessionObjectResult.forbidden();
    }

    await this.userDeviceSessionsRepository.deleteSessionByDeviceId(deviceId);

    return sessionObjectResult.success();
  }
}
