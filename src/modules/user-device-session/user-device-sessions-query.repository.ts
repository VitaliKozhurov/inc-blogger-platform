import { injectable } from 'inversify';
import { Types } from 'mongoose';

import { UserDeviceSessionViewModelDTO } from './dto/user-device-session-view-model.dto';
import { UserDeviceSessionType } from './types/user-device-session.types';
import { UserDeviceSessionModel } from './user-device-session.model';

type UserDeviceSessionMapInputType = { _id: Types.ObjectId } & UserDeviceSessionType;

@injectable()
export class UserDeviceSessionsQueryRepository {
  async getSessionsByUserId(userId: string) {
    const sessions = await UserDeviceSessionModel.find({ userId }).lean().exec();

    return sessions.map(this.mapToViewModel);
  }
  private mapToViewModel({
    ip,
    deviceName,
    deviceId,
    iat,
  }: UserDeviceSessionMapInputType): UserDeviceSessionViewModelDTO {
    return { ip, title: deviceName, deviceId, lastActiveDate: iat.toISOString() };
  }
}
