import { authTokenAdapter } from '../adapters';
import { userSessionRepository } from '../repository';

type SaveSessionArgs = {
  refreshToken: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
};

export const userSessionService = {
  async saveUserSession(args: SaveSessionArgs) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const refreshTokenPayload = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const userSessionData = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat: new Date(refreshTokenPayload.iat * 1000),
      expirationAt: new Date(refreshTokenPayload.exp * 1000),
    };

    await userSessionRepository.addUserSession(userSessionData);
  },
};
