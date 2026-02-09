import { Request } from 'express';
import requestIp from 'request-ip';

export const getRequestIp = (req: Request) => {
  return requestIp.getClientIp(req) ?? 'Cannot determine the IP address';
};
