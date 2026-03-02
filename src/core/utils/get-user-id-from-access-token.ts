import { AuthTokenAdapter } from '../../auth/adapters';
import { iocContainer } from '../../composition-root';

export const getUserIdFromAccessToken = (tokenString: string | undefined) => {
  if (!tokenString) {
    return null;
  }

  const [authType, token] = tokenString.split(' ');

  if (authType !== 'Bearer') {
    return null;
  }

  const authTokenAdapter = iocContainer.get(AuthTokenAdapter);

  const result = authTokenAdapter.verifyAccessToken(token);

  return result.success ? result.payload.userId : null;
};
