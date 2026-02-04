import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type PayloadType = Record<string, unknown>;
type CreateToken = {
  payload: PayloadType;
  secret: string;
  expiresIn: SignOptions['expiresIn'];
};

type VerifyToken = {
  token: string;
  secret: string;
};

export const jwtAdapter = {
  createJWT({ payload, secret, expiresIn }: CreateToken) {
    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
  },
  verifyJWT<T extends JwtPayload>({ token, secret }: VerifyToken) {
    try {
      const payload = jwt.verify(token, secret) as T;

      return { success: true, payload };
    } catch {
      return { success: false, payload: null };
    }
  },
  decodeJWT<T extends JwtPayload>(token: string) {
    try {
      return jwt.decode(token) as T;
    } catch {
      return null;
    }
  },
};
