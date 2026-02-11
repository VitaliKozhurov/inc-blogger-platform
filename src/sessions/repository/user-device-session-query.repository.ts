import { userDeviceSessionCollection } from '../../db';
import { SessionViewModelType, UserSessionDBType } from '../types';

export const userDeviceSessionQWRepository = {
  async getUserSessions(): Promise<SessionViewModelType[]> {
    const sessions = await userDeviceSessionCollection.find().toArray();

    return sessions.map(this._mapToViewModel);
  },
  async getUserSessionsForUserById(userId: string): Promise<SessionViewModelType[]> {
    const sessions = await userDeviceSessionCollection.find({ userId }).toArray();

    return sessions.map(this._mapToViewModel);
  },
  _mapToViewModel({ ip, deviceName, deviceId, iat }: UserSessionDBType): SessionViewModelType {
    return { ip, title: deviceName, deviceId, lastActiveDate: new Date(iat * 1000).toISOString() };
  },
};
