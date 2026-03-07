export type CreateUserDeviceSessionType = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: Date;
  expirationAt: Date;
};
