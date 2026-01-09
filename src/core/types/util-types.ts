import { Request } from 'express';

export type Nullable<T> = T | null;
export type IdParamType = { id: string };

export type RequestWithUriParamType<P = IdParamType> = Request<P>;
export type RequestWithBodyType<B> = Request<unknown, unknown, B>;
export type RequestWithBodyAndParamType<P, B> = Request<P, unknown, B>;
