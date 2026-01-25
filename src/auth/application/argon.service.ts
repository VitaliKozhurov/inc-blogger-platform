import argon2 from 'argon2';

export const argonService = {
  async createHash(password: string) {
    return argon2.hash(password);
  },
  async verifyPassword({ password, hash }: { password: string; hash: string }) {
    return argon2.verify(hash, password);
  },
};
