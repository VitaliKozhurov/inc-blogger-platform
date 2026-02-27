import { inject, injectable } from 'inversify';

import { PasswordHashAdapter } from '../../core/adapters';
import { UsersRepository } from '../repository';
import { CreateUserInputType } from '../types';
import { usersObjectResult } from '../utils/users-object-result';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PasswordHashAdapter) private passwordHashAdapter: PasswordHashAdapter
  ) {}

  async createUser(user: CreateUserInputType) {
    const [userByLogin, userByEmail] = await Promise.all([
      this.usersRepository.getUserByLoginOrEmail(user.login),
      this.usersRepository.getUserByLoginOrEmail(user.email),
    ]);

    if (userByLogin) {
      return usersObjectResult.invalidCredentials('login');
    }

    if (userByEmail) {
      return usersObjectResult.invalidCredentials('email');
    }

    const { login, email, password } = user;

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(password);

    const newUser = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: '',
        expirationDate: null,
      },
    };

    const id = await this.usersRepository.createUser(newUser);

    return usersObjectResult.success({ id });
  }

  async deleteUserById(id: string) {
    const isDeleted = await this.usersRepository.deleteUserById(id);

    if (isDeleted) {
      return usersObjectResult.success();
    }

    return usersObjectResult.notFoundUser();
  }
}
