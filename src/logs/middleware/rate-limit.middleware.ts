import { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';

import { HTTP_STATUSES } from '../../core/types';
import { requestLogsRepository } from '../repository/request-logs.repository';

export const rateLimitMiddleware =
  (attemptsLimit: number) => async (req: Request, res: Response, next: NextFunction) => {
    const ip = requestIp.getClientIp(req) ?? 'Cannot determine the IP address';
    const url = req.originalUrl;

    const requestsCount = await requestLogsRepository.getRequestByFilterCount({ ip, url });

    if (requestsCount > attemptsLimit) {
      return res.sendStatus(HTTP_STATUSES.MANY_REQUESTS);
    }

    await requestLogsRepository.addRequestLog({ ip, url, date: new Date() });

    next();
  };
