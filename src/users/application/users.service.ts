import argon2 from 'argon2';

import { createErrorMessages } from '../../core/utils';
import { usersQWRepository } from '../repository';
import { usersRepository } from '../repository/users.repository';
import { CreateUserInputType, UserDBType } from '../types';

export const usersService = {
  async createUser(user: CreateUserInputType) {
    const availabilityErrors = await this._validateLoginEmailAvailability(user.login, user.email);

    if (availabilityErrors) {
      return availabilityErrors;
    }

    const { login, email, password } = user;

    const passwordHash = await argon2.hash(password);

    const newUser: UserDBType = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const userId = await usersRepository.createUser(newUser);

    return userId;
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
          messages: 'User with the same login already exists',
        },
      ]);
    }

    const userByEmail = await usersQWRepository.getUserByLoginOrEmail(email);

    if (userByEmail) {
      return createErrorMessages([
        {
          field: 'email',
          messages: 'User with the same email already exists',
        },
      ]);
    }

    return null;
  },
};
