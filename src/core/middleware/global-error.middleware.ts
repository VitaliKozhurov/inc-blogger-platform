import { NextFunction, Request, Response } from 'express';

export const globalErrorMiddleware = (
  error: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (error instanceof Error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
