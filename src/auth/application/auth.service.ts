import argon2 from 'argon2';

import { UnAuthorizedError } from '../../core/errors/unauthorized-error';
import { usersQWRepository } from '../../users/repository';
import { LoginInputType } from '../types';

export const authService = {
  async login(credentials: LoginInputType) {
    const { loginOrEmail, password } = credentials;

    const user = await usersQWRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnAuthorizedError('Unauthorized user');
    }

    const isVerified = await argon2.verify(user.passwordHash, password);

    if (!isVerified) {
      throw new UnAuthorizedError('Unauthorized user');
    }
  },
};
