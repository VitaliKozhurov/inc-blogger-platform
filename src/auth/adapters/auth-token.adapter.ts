import { jwtAdapter } from '../../core/adapters';
import { SETTINGS } from '../../core/settings';

type AccessTokenPayload = {
  userId: string;
};

export const authTokenAdapter = {
  createAccessToken(payload: AccessTokenPayload) {
    return jwtAdapter.createJWT({
      payload,
      secret: SETTINGS.JWT_ACCESS_SECRET,
      expiresIn: Number(SETTINGS.JWT_ACCESS_TIME),
    });
  },
  verifyAccessToken(token: string) {
    return jwtAdapter.verifyJWT<AccessTokenPayload>({
      token,
      secret: SETTINGS.JWT_ACCESS_SECRET,
    });
  },
};
