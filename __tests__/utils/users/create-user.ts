import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { UserViewModelType } from '../../../src/users/types';
import { TestManager } from '../test-manager';

import { mockUser } from './mock';

export const createUser = async (testManager: TestManager): Promise<UserViewModelType> => {
  const { body } = await testManager.context
    .request()
    .post(`${APP_ROUTES.USERS}`)
    .set('Authorization', testManager.authToken)
    .send(mockUser)
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
