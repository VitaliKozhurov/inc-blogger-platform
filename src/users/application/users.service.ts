import argon2 from 'argon2';

import { usersRepository } from '../repository/users.repository';
import { CreateUserInputType, UserDBType } from '../types';

export const usersService = {
  async createUser(user: CreateUserInputType) {
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
};
