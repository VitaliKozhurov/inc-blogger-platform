import { SETTINGS } from '../../src/core/settings';

export const getAuthToken = () => {
  return SETTINGS.AUTH_TOKEN ?? '';
};
