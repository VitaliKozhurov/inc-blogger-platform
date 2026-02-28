import { sub } from 'date-fns';

import { RequestLogType, RequestLogModel } from '../model';
import { RequestLogDBType } from '../types';

export const requestLogsRepository = {
  async getRequestByFilterCount(
    filter: { timeWindowDurationSeconds: number } & Omit<RequestLogDBType, 'date'>
  ) {
    const count = await RequestLogModel.countDocuments({
      ip: filter.ip,
      url: filter.url,
      date: { $gte: sub(new Date(), { seconds: filter.timeWindowDurationSeconds }) },
    });

    return count;
  },

  async addRequestLog(log: Omit<RequestLogType, '_id'>) {
    const { id } = await RequestLogModel.create(log);

    return id;
  },
};
