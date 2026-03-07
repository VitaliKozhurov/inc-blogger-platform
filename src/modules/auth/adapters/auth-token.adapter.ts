import { inject, injectable } from 'inversify';

import { SETTINGS } from '../../../config/settings';
import { JWTAdapter } from '../../../core/adapters';

type AccessTokenPayload = {
  userId: string;
};

type RefreshTokenPayload = AccessTokenPayload & {
  deviceId: string;
};

type VerifiedRefreshTokenPayload = RefreshTokenPayload & { iat: number; exp: number };

@injectable()
export class AuthTokenAdapter {
  constructor(@inject(JWTAdapter) private jwtAdapter: JWTAdapter) {}

  createAccessToken(payload: AccessTokenPayload) {
    return this.jwtAdapter.createJWT({
      payload,
      secret: SETTINGS.JWT_ACCESS_SECRET,
      expiresIn: Number(SETTINGS.JWT_ACCESS_TIME),
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtAdapter.verifyJWT<AccessTokenPayload>({
      token,
      secret: SETTINGS.JWT_ACCESS_SECRET,
    });
  }

  createRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtAdapter.createJWT({
      payload,
      secret: SETTINGS.JWT_REFRESH_SECRET,
      expiresIn: Number(SETTINGS.JWT_ACCESS_TIME),
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtAdapter.verifyJWT<VerifiedRefreshTokenPayload>({
      token,
      secret: SETTINGS.JWT_REFRESH_SECRET,
    });
  }

  decodeRefreshToken(token: string) {
    return this.jwtAdapter.decodeJWT<VerifiedRefreshTokenPayload>(token);
  }
}
