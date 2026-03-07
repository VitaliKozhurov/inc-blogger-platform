import { sub } from 'date-fns';

import { RequestLogQueryDTO } from './dto/request-log-query.dto';
import { RequestLogModel } from './request-log.model';
import { RequestLogType } from './types/request-log.types';

export const requestLogsRepository = {
  async getRequestByFilterCount(filter: RequestLogQueryDTO) {
    const count = await RequestLogModel.countDocuments({
      ip: filter.ip,
      url: filter.url,
      date: { $gte: sub(new Date(), { seconds: filter.timeWindowDurationSeconds }) },
    });

    return count;
  },

  async addRequestLog(log: RequestLogType) {
    const { id } = await RequestLogModel.create(log);

    return id;
  },
};
