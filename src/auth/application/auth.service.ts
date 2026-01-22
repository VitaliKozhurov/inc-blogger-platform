import { LoginInputType } from '../types';

export const authService = {
  async login(credentials: LoginInputType) {
    console.log(credentials);
  },
};
