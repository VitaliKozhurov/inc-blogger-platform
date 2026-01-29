import { argonService } from '../../auth/application';
import { HTTP_STATUSES } from '../../core/types';
import { createErrorMessages } from '../../core/utils';
import { usersQWRepository } from '../repository';
import { usersRepository } from '../repository/users.repository';
import { CreateUserInputType, UserDBType } from '../types';

export const usersService = {
  async createUser(user: CreateUserInputType) {
    const availabilityErrors = await this._validateLoginEmailAvailability(user.login, user.email);

    if (availabilityErrors) {
      return {
        status: HTTP_STATUSES.BAD_REQUEST,
        data: null,
        extensions: availabilityErrors.errorMessages,
        errorMessage: 'Invalid credentials',
      };
    }

    const { login, email, password } = user;

    const passwordHash = await argonService.createHash(password);

    // TODO нормально ли так формировать пользователя (confirmationCode, expirationDate)
    const newUser: UserDBType = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: '',
        expirationDate: '',
      },
    };

    const id = await usersRepository.createUser(newUser);

    return {
      status: HTTP_STATUSES.OK,
      data: { id },
      extensions: [],
    };
  },

  async deleteUserById(id: string) {
    return usersRepository.deleteUserById(id);
  },

  async _validateLoginEmailAvailability(login: string, email: string) {
    const userByLogin = await usersQWRepository.getUserByLoginOrEmail(login);

    if (userByLogin) {
      return createErrorMessages([
        {
          field: 'login',
          message: 'User with the same login already exists',
        },
      ]);
    }

    const userByEmail = await usersQWRepository.getUserByLoginOrEmail(email);

    if (userByEmail) {
      return createErrorMessages([
        {
          field: 'email',
          message: 'User with the same email already exists',
        },
      ]);
    }

    return null;
  },
};
