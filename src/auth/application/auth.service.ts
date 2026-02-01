import { randomUUID } from 'crypto';

import { add } from 'date-fns/add';

import { HTTP_STATUSES, ResultType } from '../../core/types';
import { usersQWRepository } from '../../users/repository';
import { usersRepository } from '../../users/repository/users.repository';
import { UserDBType } from '../../users/types';
import { argonAdapter, emailAdapter, jwtAdapter } from '../adapters';
import { LoginInputType, RegistrationEmailResendingType, RegistrationInputType } from '../types';

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

    if (!user.emailConfirmation.isConfirmed) {
      return {
        data: null,
        status: HTTP_STATUSES.UNAUTHORIZED,
        extensions: [{ field: null, message: 'Account should be confirmed' }],
        errorMessage: 'Account should be confirmed',
      };
    }

    const accessToken = jwtAdapter.createJWT({ userId: user._id.toString() });

    return {
      data: { accessToken },
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  async registration(credentials: RegistrationInputType) {
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

    emailAdapter.sendRegistrationConfirmation({ email, code: confirmationCode });

    return {
      data: userId,
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  async registrationConfirmation(code: string) {
    const user = await usersQWRepository.getUserByConfirmationCode(code);

    if (!user) {
      return this._buildEmailConfirmationErrorResult();
    }

    if (user.emailConfirmation.isConfirmed) {
      return this._buildEmailConfirmationErrorResult();
    }

    if (new Date(user.emailConfirmation.expirationDate) < new Date()) {
      return this._buildEmailConfirmationErrorResult();
    }

    const userData = {
      ...user,
      emailConfirmation: { isConfirmed: true, confirmationCode: '', expirationDate: '' },
    };

    const isUpdated = await usersRepository.updateUserById({ id: user._id.toString(), userData });

    if (!isUpdated) {
      return {
        data: null,
        status: HTTP_STATUSES.BAD_REQUEST,
        extensions: [{ field: '', message: 'User update error' }],
        errorMessage: 'User update error',
      };
    }

    return {
      data: null,
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  async registrationEmailResending(credentials: RegistrationEmailResendingType) {
    const userByEmail = await usersQWRepository.getUserByLoginOrEmail(credentials.email);

    if (userByEmail?.emailConfirmation.isConfirmed) {
      return {
        data: null,
        status: HTTP_STATUSES.BAD_REQUEST,
        extensions: [{ field: 'null', message: 'User is confirmed' }],
        errorMessage: 'User is confirmed',
      };
    }

    const confirmationCode = randomUUID();

    emailAdapter.resendRegistrationConfirmation({
      email: credentials.email,
      code: confirmationCode,
    });

    return {
      data: null,
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

  _buildEmailConfirmationErrorResult() {
    return {
      data: null,
      status: HTTP_STATUSES.BAD_REQUEST,
      extensions: [{ field: 'code', message: 'Code confirmation operation failed' }],
      errorMessage: 'Code confirmation operation failed',
    };
  },
};
