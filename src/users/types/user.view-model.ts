import { UserDBType } from './user.db';

export type UserViewModelType = { id: string } & Omit<UserDBType, 'passwordHash'>;

export type MeUserViewModelType = {
  email: string;
  login: string;
  userId: string;
};
