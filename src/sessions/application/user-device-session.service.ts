import { authTokenAdapter } from '../../auth/adapters';
import { userDeviceSessionRepository } from '../repository';
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

export const userDeviceSessionService = {
  async saveUserSession(args: SaveSessionArgs) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const { iat, exp: expirationAt } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const userSessionData = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat,
      expirationAt,
      expirationDate: new Date(expirationAt * 1000),
    };

    await userDeviceSessionRepository.addUserSession(userSessionData);
  },
  async updateUserSession({ prevIat, ip, refreshToken }: UpdateSessionArgs) {
    const { deviceId, iat, exp: expirationAt } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    return userDeviceSessionRepository.updateUserSession({
      deviceId,
      prevIat,
      ip,
      iat,
      expirationAt,
      expirationDate: new Date(expirationAt * 1000),
    });
  },
  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const { deviceId } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userDeviceSessionRepository.deleteUserSessionsExceptTheCurrent({ deviceId });
  },
  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const { deviceId } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userDeviceSessionRepository.deleteUserSession({ deviceId });

    return sessionObjectResult.success();
  },
  async deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
  }) {
    const decodedToken = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const sessionForDeleting = await userDeviceSessionRepository.getUserSessionByFilter({
      deviceId,
    });

    if (!sessionForDeleting) {
      return sessionObjectResult.notFound();
    }

    const isMySession = !!(await userDeviceSessionRepository.getUserSessionByFilter({
      deviceId,
      userId: decodedToken.userId,
    }));

    if (!isMySession) {
      return sessionObjectResult.forbidden();
    }

    await userDeviceSessionRepository.deleteUserSession({ deviceId });

    return sessionObjectResult.success();
  },
};
