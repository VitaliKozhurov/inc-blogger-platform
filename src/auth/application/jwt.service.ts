import jwt from 'jsonwebtoken';

import { SETTINGS } from '../../core/settings';

export type AccessTokenPayloadType = { userId: string };

export const jwtService = {
  createJWT(payload: AccessTokenPayloadType) {
    const token = jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET, {
      expiresIn: SETTINGS.JWT_ACCESS_TIME,
    });

    return token;
  },
  verifyJWT(token: string) {
    try {
      return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET) as AccessTokenPayloadType;
    } catch {
      return null;
    }
  },
  decodeJWT(token: string) {
    try {
      return jwt.decode(token) as AccessTokenPayloadType;
    } catch {
      return null;
    }
  },
};
