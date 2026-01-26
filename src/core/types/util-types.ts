/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from 'express';

export type Nullable<T> = T | null;
export type IdParamType = { id: string };

export type RequestWithUriParamType<P = IdParamType> = Request<P>;
export type RequestWithBodyType<B> = Request<{}, {}, B>;
export type RequestWithParamAndBodyType<P, B> = Request<P, {}, B>;
export type RequestWithParamAndQueryType<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithQueryType<Q> = Request<{}, {}, {}, Q>;
