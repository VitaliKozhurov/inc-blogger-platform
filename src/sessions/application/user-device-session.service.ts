import { inject, injectable } from 'inversify';

import { AuthTokenAdapter } from '../../auth/adapters';
import { UserDeviceSessionsRepository } from '../repository';
import { sessionObjectResult } from '../utils/session-object-result';
type SaveSessionArgs = {
  refreshToken: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
};

type UpdateSessionArgs = {
  prevIat: number;
  ip: string;
  refreshToken: string;
};

@injectable()
export class UserDeviceSessionsService {
  constructor(
    @inject(AuthTokenAdapter) private authTokenAdapter: AuthTokenAdapter,
    @inject(UserDeviceSessionsRepository)
    private userDeviceSessionsRepository: UserDeviceSessionsRepository
  ) {}

  async saveUserSession(args: SaveSessionArgs) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const { iat, exp: expirationAt } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const userSessionData = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat,
      expirationAt,
      expirationDate: new Date(expirationAt * 1000),
    };

    await this.userDeviceSessionsRepository.addUserSession(userSessionData);
  }
  async updateUserSession({ prevIat, ip, refreshToken }: UpdateSessionArgs) {
    const {
      deviceId,
      iat,
      exp: expirationAt,
    } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    return this.userDeviceSessionsRepository.updateUserSession({
      deviceId,
      prevIat,
      ip,
      iat,
      expirationAt,
      expirationDate: new Date(expirationAt * 1000),
    });
  }
  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const { deviceId } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await this.userDeviceSessionsRepository.deleteUserSessionsExceptTheCurrent({ deviceId });
  }
  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const { deviceId } = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await this.userDeviceSessionsRepository.deleteUserSession({ deviceId });

    return sessionObjectResult.success();
  }
  async deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
  }) {
    const decodedToken = this.authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const sessionForDeleting = await this.userDeviceSessionsRepository.getUserSessionByFilter({
      deviceId,
    });

    if (!sessionForDeleting) {
      return sessionObjectResult.notFound();
    }

    const session = await this.userDeviceSessionsRepository.getUserSessionByFilter({
      deviceId,
      userId: decodedToken.userId,
    });

    const isMySession = !!session;

    if (!isMySession) {
      return sessionObjectResult.forbidden();
    }

    await this.userDeviceSessionsRepository.deleteUserSession({ deviceId });

    return sessionObjectResult.success();
  }
}
