import { HydratedDocument } from 'mongoose';

type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate?: Date | null;
  isConfirmed: boolean;
};

type PasswordRecoveryType = {
  recoveryCode: string;
  expirationDate?: Date | null;
};

export type UserType = {
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  emailConfirmation: EmailConfirmationType;
  passwordRecovery?: PasswordRecoveryType;
};

export type UserDocument = HydratedDocument<UserType>;

export type UserStaticMethodsType = {
  checkIsUserExist(args: {
    login: string;
    email: string;
  }): Promise<{ isExist: true; byField: 'login' | 'email' } | { isExist: false }>;
  createUserInstance(args: {
    login: string;
    email: string;
    passwordHash: string;
  }): Promise<UserDocument>;
};
