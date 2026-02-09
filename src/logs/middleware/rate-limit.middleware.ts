import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../core/types';
import { getRequestIp } from '../../core/utils';
import { requestLogsRepository } from '../repository/request-logs.repository';

export const getRateLimitMiddleware =
  (attemptsLimit: number = 5) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip = getRequestIp(req);
    const url = req.originalUrl;

    const requestsCount = await requestLogsRepository.getRequestByFilterCount({ ip, url });

    if (requestsCount > attemptsLimit) {
      return res.sendStatus(HTTP_STATUSES.MANY_REQUESTS);
    }

    await requestLogsRepository.addRequestLog({ ip, url, date: new Date() });

    next();
  };
