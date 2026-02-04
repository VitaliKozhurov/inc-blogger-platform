import argon2 from 'argon2';

export const passwordHashAdapter = {
  async createPasswordHash(password: string) {
    return argon2.hash(password);
  },
  async verifyPassword({ password, hash }: { password: string; hash: string }) {
    return argon2.verify(hash, password);
  },
};
