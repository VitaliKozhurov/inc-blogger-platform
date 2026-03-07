import { SETTINGS } from '../../src/config/settings';

export const getAuthToken = () => {
  return SETTINGS.AUTH_TOKEN ?? '';
};
