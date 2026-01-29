import { UserDBType } from './user.db';

export type UserViewModelType = { id: string } & Omit<
  UserDBType,
  'passwordHash' | 'emailConfirmation'
>;

export type MeUserViewModelType = {
  email: string;
  login: string;
  userId: string;
};
