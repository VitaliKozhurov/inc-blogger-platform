import argon2 from 'argon2';

import { UnAuthorizedError } from '../../core/errors/unauthorized-error';
import { usersQWRepository } from '../../users/repository';
import { LoginInputType } from '../types';

export const authService = {
  async login(credentials: LoginInputType) {
    const { loginOrEmail, password } = credentials;

    const { passwordHash } = await usersQWRepository.getUserByLoginOrEmail(loginOrEmail);

    const isVerified = await argon2.verify(passwordHash, password);

    if (!isVerified) {
      throw new UnAuthorizedError('Unauthorized user');
    }

    return;
  },
};
