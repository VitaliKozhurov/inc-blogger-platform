import { authTokenAdapter } from '../../auth/adapters';
import { userSessionRepository } from '../repository';
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

export const userSessionService = {
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
    };

    await userSessionRepository.addUserSession(userSessionData);
  },
  async updateUserSession({ prevIat, ip, refreshToken }: UpdateSessionArgs) {
    const { deviceId, iat, exp: expirationAt } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    return userSessionRepository.updateUserSession({
      deviceId,
      prevIat,
      ip,
      iat,
      expirationAt,
    });
  },
  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const { deviceId } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userSessionRepository.deleteUserSessionsExceptTheCurrent({ deviceId });
  },
  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const { deviceId } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userSessionRepository.deleteUserSession({ deviceId });

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

    const sessionForDeleting = await userSessionRepository.getUserSessionsByDeviceId(deviceId);

    if (!sessionForDeleting) {
      return sessionObjectResult.notFound();
    }

    const mySessions = await userSessionRepository.getUserSessionsByUserId(decodedToken.userId);

    const isMySession = !!mySessions.find(s => s.deviceId === deviceId);

    if (!isMySession) {
      return sessionObjectResult.forbidden();
    }

    await userSessionRepository.deleteUserSession({ deviceId });

    return sessionObjectResult.success();
  },
};
