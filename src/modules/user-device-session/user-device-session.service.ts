import { inject, injectable } from 'inversify';

import { AuthTokenAdapter } from '../../auth/adapters';
import { convertUnixTimeToDate } from '../../core/utils';

import { UserDeviceSessionModel } from './user-device-session.model';
import { UserDeviceSessionsRepository } from './user-device-sessions.repository';
import { sessionObjectResult } from './utils/session-object-result';

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

    const useDeviceSessionDocument = await UserDeviceSessionModel.createUserDevicesSessionInstance({
      userId,
      deviceId,
      deviceName,
      ip,
      iat: convertUnixTimeToDate(iat),
      expirationAt: convertUnixTimeToDate(exp),
    });

    return sessionObjectResult.success(useDeviceSessionDocument._id.toString());
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

    const userDeviceSession = await this.userDeviceSessionsRepository.getSessionByFilter({
      deviceId,
    });

    if (!userDeviceSession) {
      return sessionObjectResult.notFoundSession();
    }

    if (userDeviceSession.checkIsForeignSession(decodedToken.userId)) {
      return sessionObjectResult.forbidden();
    }

    await this.userDeviceSessionsRepository.deleteSessionByDeviceId(deviceId);

    return sessionObjectResult.success();
  }
}
