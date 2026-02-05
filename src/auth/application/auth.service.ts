import { randomUUID } from 'crypto';

import { add } from 'date-fns/add';

import { passwordHashAdapter } from '../../core/adapters';
import { HTTP_STATUSES } from '../../core/types';
import { usersRepository } from '../../users/repository/users.repository';
import { UserDBType } from '../../users/types';
import { authTokenAdapter, emailRegistrationAdapter } from '../adapters';
import { LoginInputType, RegistrationEmailResendingType, RegistrationInputType } from '../types';
import { authObjectResult } from '../utils/auth-object-result';

export const authService = {
  async login(credentials: LoginInputType) {
    const { loginOrEmail, password } = credentials;

    const user = await usersRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return authObjectResult.invalidCredentials();
    }

    const isVerified = await passwordHashAdapter.verifyPassword({
      password,
      hash: user.passwordHash,
    });

    if (!isVerified) {
      return authObjectResult.invalidCredentials();
    }

    if (!user.emailConfirmation.isConfirmed) {
      return authObjectResult.emailNotVerified();
    }

    const accessToken = authTokenAdapter.createAccessToken({ userId: user._id.toString() });

    return authObjectResult.success({ accessToken });
  },
  async registration(credentials: RegistrationInputType) {
    const { login, email, password } = credentials;

    const [useByLogin, userByEmail] = await Promise.all([
      usersRepository.getUserByLoginOrEmail(login),
      usersRepository.getUserByLoginOrEmail(email),
    ]);

    if (userByEmail) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    if (useByLogin) {
      return authObjectResult.registrationInvalidCredentials('login');
    }

    const passwordHash = await passwordHashAdapter.createPasswordHash(password);

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

    emailRegistrationAdapter.sendConfirmationCode({ email, code: confirmationCode });

    return authObjectResult.success(userId);
  },
  async registrationConfirmation(code: string) {
    const user = await usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (user.emailConfirmation.isConfirmed) {
      return authObjectResult.invalidConfirmationCode();
    }

    if (new Date(user.emailConfirmation.expirationDate) < new Date()) {
      return authObjectResult.invalidConfirmationCode();
    }

    const userData = {
      ...user,
      emailConfirmation: { isConfirmed: true, confirmationCode: '', expirationDate: '' },
    };

    await usersRepository.updateUserById({ id: user._id.toString(), userData });

    return authObjectResult.success();

    return {
      data: null,
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
  async registrationEmailResending(credentials: RegistrationEmailResendingType) {
    const userByEmail = await usersRepository.getUserByLoginOrEmail(credentials.email);

    if (!userByEmail) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    if (userByEmail.emailConfirmation.isConfirmed) {
      return authObjectResult.registrationInvalidCredentials('email');
    }

    const confirmationCode = randomUUID();

    const userData = {
      ...userByEmail,
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
      },
    };

    await usersRepository.updateUserById({ id: userByEmail._id.toString(), userData });

    emailRegistrationAdapter.resendConfirmationCode({
      email: credentials.email,
      code: confirmationCode,
    });

    return authObjectResult.success();
  },
};
