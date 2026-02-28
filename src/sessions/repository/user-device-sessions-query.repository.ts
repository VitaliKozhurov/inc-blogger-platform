import { injectable } from 'inversify';

import { UserDeviceSessionModel, UserDeviceSessionType } from '../model';
import { SessionViewModelType } from '../types';

@injectable()
export class UserDeviceSessionsQueryRepository {
  async getUserDeviceSessionsByUserId(userId: string): Promise<SessionViewModelType[]> {
    const sessions = await UserDeviceSessionModel.find({ userId }).exec();

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
