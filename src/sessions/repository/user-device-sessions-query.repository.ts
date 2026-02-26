import { injectable } from 'inversify';

import { userDeviceSessionCollection } from '../../db';
import { SessionViewModelType, UserSessionDBType } from '../types';

@injectable()
export class UserDeviceSessionsQueryRepository {
  async getUserSessions(): Promise<SessionViewModelType[]> {
    const sessions = await userDeviceSessionCollection.find().toArray();

    return sessions.map(this.mapToViewModel);
  }
  async getUserSessionsForUserById(userId: string): Promise<SessionViewModelType[]> {
    const sessions = await userDeviceSessionCollection.find({ userId }).toArray();

    return sessions.map(this.mapToViewModel);
  }
  private mapToViewModel({
    ip,
    deviceName,
    deviceId,
    iat,
  }: UserSessionDBType): SessionViewModelType {
    return { ip, title: deviceName, deviceId, lastActiveDate: new Date(iat * 1000).toISOString() };
  }
}
