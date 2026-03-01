import { injectable } from 'inversify';

import { UserDeviceSessionModel, UserDeviceSessionType } from '../model';
import { SessionViewModelType } from '../types';

@injectable()
export class UserDeviceSessionsQueryRepository {
  async getSessionsByUserId(userId: string): Promise<SessionViewModelType[]> {
    const sessions = await UserDeviceSessionModel.find({ userId }).lean().exec();

    return sessions.map(this.mapToViewModel);
  }
  private mapToViewModel({
    ip,
    deviceName,
    deviceId,
    iat,
  }: UserDeviceSessionType): SessionViewModelType {
    return { ip, title: deviceName, deviceId, lastActiveDate: iat.toISOString() };
  }
}
