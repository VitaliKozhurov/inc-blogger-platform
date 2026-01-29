export type UserDBType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
};
