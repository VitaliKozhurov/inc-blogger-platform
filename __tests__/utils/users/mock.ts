import { SETTINGS } from '../../../src/config/settings';
import { CreateUserRequestDTO } from '../../../src/modules/users/dto/create-user.dto';

export const mockUser: CreateUserRequestDTO = {
  login: 'admin',
  password: 'admin_password',
  email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
};
