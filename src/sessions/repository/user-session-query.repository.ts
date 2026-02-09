import { userSessionCollection } from '../../db';
import { SessionViewModelType, UserSessionDBType } from '../types';

export const userSessionQWRepository = {
  async getUserSessions(): Promise<SessionViewModelType[]> {
    const sessions = await userSessionCollection.find().toArray();

    return sessions.map(this._mapToViewModel);
  },
  _mapToViewModel({ ip, deviceName, deviceId, iat }: UserSessionDBType): SessionViewModelType {
    return { ip, title: deviceName, deviceId, lastActiveDate: new Date(iat * 1000).toISOString() };
  },
};
