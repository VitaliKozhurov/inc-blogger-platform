import { HTTP_STATUSES, ResultType } from '../../core/types';
import { usersQWRepository } from '../../users/repository';
import { LoginInputType } from '../types';

import { argonService } from './argon.service';
import { jwtService } from './jwt.service';

export const authService = {
  async login(credentials: LoginInputType) {
    const { loginOrEmail, password } = credentials;

    const user = await usersQWRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return this._buildErrorResult();
    }

    const isVerified = await argonService.verifyPassword({ password, hash: user.passwordHash });

    if (!isVerified) {
      return this._buildErrorResult();
    }

    const accessToken = jwtService.createJWT({ userId: user._id.toString() });

    return {
      data: { accessToken },
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
