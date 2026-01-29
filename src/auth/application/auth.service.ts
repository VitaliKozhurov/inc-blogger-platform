import { randomUUID } from 'crypto';

import { add } from 'date-fns/add';

import { HTTP_STATUSES, ResultType } from '../../core/types';
import { usersQWRepository } from '../../users/repository';
import { usersRepository } from '../../users/repository/users.repository';
import { UserDBType } from '../../users/types';
import { argonAdapter, emailAdapter, jwtAdapter } from '../adapters';
import { LoginInputType, RegistrationInputType } from '../types';

export const authService = {
  async login(credentials: LoginInputType) {
    const { loginOrEmail, password } = credentials;

    const user = await usersQWRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return this._buildErrorResult();
    }

    const isVerified = await argonAdapter.verifyPassword({ password, hash: user.passwordHash });

    if (!isVerified) {
      return this._buildErrorResult();
    }

    const accessToken = jwtAdapter.createJWT({ userId: user._id.toString() });

    return {
      data: { accessToken },
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  async register(credentials: RegistrationInputType) {
    const { login, email, password } = credentials;

    const useByLogin = await usersQWRepository.getUserByLoginOrEmail(login);
    const userByEmail = await usersQWRepository.getUserByLoginOrEmail(email);

    if (useByLogin || userByEmail) {
      return {
        data: null,
        status: HTTP_STATUSES.BAD_REQUEST,
        extensions: [{ field: 'null', message: 'User with such credentials is in the system' }],
        errorMessage: 'User with the same login or email exist',
      };
    }

    const passwordHash = await argonAdapter.createHash(password);

    const confirmationCode = randomUUID();

    const newUser: UserDBType = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
      },
    };

    const userId = await usersRepository.createUser(newUser);

    await emailAdapter.sendRegistrationConfirmation({ email, code: confirmationCode });

    return {
      data: userId,
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  _buildErrorResult() {
    const result: ResultType = {
      data: null,
      status: HTTP_STATUSES.UNAUTHORIZED,
      extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
      errorMessage: 'Unauthorized error',
    };

    return result;
  },
};
