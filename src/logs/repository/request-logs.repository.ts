import { sub } from 'date-fns';

import { requestLogsCollection } from '../../db/mongo.db';
import { RequestLogDBType } from '../types';

export const requestLogsRepository = {
  async addRequestLog(log: RequestLogDBType): Promise<string> {
    const { insertedId } = await requestLogsCollection.insertOne(log);

    return insertedId.toString();
  },
  async getRequestByFilterCount(filter: Omit<RequestLogDBType, 'date'>): Promise<number> {
    const count = await requestLogsCollection.countDocuments({
      ip: filter.ip,
      url: filter.url,
      date: { $gte: sub(new Date(), { seconds: 10 }) },
    });

    return count;
  },
};
