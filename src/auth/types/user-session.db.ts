export type UserSessionDBType = {
  userId: string;
  deviceId: string;
  iat: Date;
  deviceName: string;
  ip: string;
  expirationAt: Date;
};
