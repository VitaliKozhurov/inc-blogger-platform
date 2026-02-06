import { APP_ROUTES } from '../../../src/core/constants';
import { TestManager } from '../test-manager';

import { createUser } from './create-user';
import { mockUser } from './mock';

type AccessTokenPayload = { body: { accessToken: string } };

export const loginUser = async (testManager: TestManager) => {
  const createdUser = await createUser(testManager);

  const { body }: AccessTokenPayload = await testManager.context
    .request()
    .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
    .send({ loginOrEmail: createdUser.login, password: mockUser.password });

  return body.accessToken;
};
