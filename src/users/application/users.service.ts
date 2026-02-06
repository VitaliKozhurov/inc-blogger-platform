import { passwordHashAdapter } from '../../core/adapters';
import { usersRepository } from '../repository/users.repository';
import { CreateUserInputType, UserDBType } from '../types';
import { usersObjectResult } from '../utils/users-object-result';

export const usersService = {
  async createUser(user: CreateUserInputType) {
    const [userByLogin, userByEmail] = await Promise.all([
      usersRepository.getUserByLoginOrEmail(user.login),
      usersRepository.getUserByLoginOrEmail(user.email),
    ]);

    if (userByLogin) {
      return usersObjectResult.invalidCredentials('login');
    }

    if (userByEmail) {
      return usersObjectResult.invalidCredentials('email');
    }

    const { login, email, password } = user;

    const passwordHash = await passwordHashAdapter.createPasswordHash(password);

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

    return usersObjectResult.success({ id });
  },

  async deleteUserById(id: string) {
    const isDeleted = await usersRepository.deleteUserById(id);

    if (isDeleted) {
      return usersObjectResult.success();
    }

    return usersObjectResult.notFoundUser();
  },
};
