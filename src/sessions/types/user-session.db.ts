export type UserSessionDBType = {
  userId: string;
  deviceId: string;
  iat: number;
  deviceName: string;
  ip: string;
  expirationAt: number;
  expirationDate: Date;
};
