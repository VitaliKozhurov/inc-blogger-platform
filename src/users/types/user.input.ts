import { UserDBType } from './user.db';

export type CreateUserInputType = Omit<
  UserDBType,
  'passwordHash' | 'createdAt' | 'emailConfirmation'
> & {
  password: string;
};
