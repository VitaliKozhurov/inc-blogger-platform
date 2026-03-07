import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/types';
import { getRequestIp } from '../../../core/utils';
import { requestLogsRepository } from '../request-logs.repository';

type Args = {
  attemptsLimit: number;
  timeWindowDurationSeconds: number;
};

export const getRateLimitMiddleware =
  (args?: Args) => async (req: Request, res: Response, next: NextFunction) => {
    const attemptsLimit = args?.attemptsLimit ?? 5;
    const timeWindowDurationSeconds = args?.timeWindowDurationSeconds ?? 10;

    const ip = getRequestIp(req);
    const url = req.originalUrl;

    await requestLogsRepository.addRequestLog({ ip, url, date: new Date() });

    const requestsCount = await requestLogsRepository.getRequestByFilterCount({
      ip,
      url,
      timeWindowDurationSeconds,
    });

    if (requestsCount > attemptsLimit) {
      return res.sendStatus(HTTP_STATUSES.MANY_REQUESTS);
    }

    next();
  };
