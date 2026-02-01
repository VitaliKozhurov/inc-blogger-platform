import { SETTINGS } from '../../../src/core/settings';
import { CreateUserInputType } from '../../../src/users/types';

export const mockUser: CreateUserInputType = {
  login: 'admin',
  password: 'admin_password',
  email: SETTINGS.EMAIL_ADDRESS ?? '',
};
