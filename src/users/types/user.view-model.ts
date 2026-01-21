import { UserDBType } from './user.db';

export type UserViewModelType = { id: string } & Omit<UserDBType, 'passwordHash'>;
