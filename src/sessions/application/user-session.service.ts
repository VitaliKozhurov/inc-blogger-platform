import { authTokenAdapter } from '../../auth/adapters';
import { authObjectResult } from '../../auth/utils/auth-object-result';
import { RESULT_STATUSES, ResultObject } from '../../core/utils';
import { userSessionRepository } from '../repository';

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
    const { deviceId, iat } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    await userSessionRepository.deleteUserSession({ deviceId, iat });

    return authObjectResult.success();
  },
  async deleteUserSessionByDeviceId({
    refreshToken,
    deviceId,
  }: {
    refreshToken: string;
    deviceId: string;
  }) {
    const { userId } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const mySessions = await userSessionRepository.getUserSessionByUserId(userId);

    const isMySession = !!mySessions.find(s => s.deviceId === deviceId);

    if (isMySession) {
      return new ResultObject({
        data: null,
        status: RESULT_STATUSES.FORBIDDEN,
        extensions: [{ field: 'deviceId', message: 'Incorrect deviceId' }],
      });
    }
  },
};
