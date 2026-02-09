import { authTokenAdapter } from '../adapters';
import { userSessionRepository } from '../repository';
import { authObjectResult } from '../utils/auth-object-result';

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
  async deleteUserSession(refreshToken: string) {
    const { deviceId, iat } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userSessionRepository.deleteUserSession({ deviceId, iat });

    return authObjectResult.success();
  },
};
