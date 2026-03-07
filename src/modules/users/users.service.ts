import { inject, injectable } from 'inversify';

import { PasswordHashAdapter } from '../../core/adapters';

import { CreateUserRequestDTO } from './dto/create-user.dto';
import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { usersObjectResult } from './utils/users-object-result';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PasswordHashAdapter) private passwordHashAdapter: PasswordHashAdapter
  ) {}

  async createUser(user: CreateUserRequestDTO) {
    const checkInputUser = await UserModel.checkIsUserExist(user);

    if (checkInputUser.isExist) {
      return usersObjectResult.invalidCredentials(checkInputUser.byField);
    }

    const { login, email, password } = user;

    const passwordHash = await this.passwordHashAdapter.createPasswordHash(password);

    const userDocument = await UserModel.createUserInstance({ login, email, passwordHash });

    await this.usersRepository.saveUser(userDocument);

    return usersObjectResult.success({ id: userDocument._id.toString() });
  }

  async deleteUserById(id: string) {
    const isDeleted = await this.usersRepository.deleteUserById(id);

    if (isDeleted) {
      return usersObjectResult.success();
    }

    return usersObjectResult.notFoundUser();
  }
}
