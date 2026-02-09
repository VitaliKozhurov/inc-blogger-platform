import { JwtPayload } from 'jsonwebtoken';

import { jwtAdapter } from '../../core/adapters';
import { SETTINGS } from '../../core/settings';

type AccessTokenPayload = {
  userId: string;
};

type RefreshTokenPayload = AccessTokenPayload & {
  deviceId: string;
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

  createRefreshToken(payload: RefreshTokenPayload) {
    return jwtAdapter.createJWT({
      payload,
      secret: SETTINGS.JWT_ACCESS_SECRET,
      expiresIn: Number(SETTINGS.JWT_ACCESS_TIME),
    });
  },
  verifyRefreshToken(token: string) {
    return jwtAdapter.verifyJWT<RefreshTokenPayload>({
      token,
      secret: SETTINGS.JWT_ACCESS_SECRET,
    });
  },
  decodeRefreshToken(token: string) {
    return jwtAdapter.decodeJWT<RefreshTokenPayload & { iat: number; exp: number }>(token);
  },
  decodeToken<T extends JwtPayload>(token: string) {
    return jwtAdapter.decodeJWT<T>(token);
  },
};
