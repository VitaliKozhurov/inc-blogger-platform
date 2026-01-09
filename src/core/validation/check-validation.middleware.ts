import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { HTTP_STATUSES } from '../constants';
import { formatExpressError } from '../utils';

export const checkValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(formatExpressError).array();

  if (errors.length > 0) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({
      errorsMessages: errors,
    });
  }

  next();
};
