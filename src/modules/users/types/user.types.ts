import { HydratedDocument } from 'mongoose';

import { CreateUserDTO } from '../dto/create-user.dto';

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

export type UserDocument = HydratedDocument<UserType, UserMethodsType>;

export type UserStaticMethodsType = {
  checkIsUserExist(args: {
    login: string;
    email: string;
  }): Promise<{ isExist: true; byField: 'login' | 'email' } | { isExist: false }>;
  createUserInstance(args: CreateUserDTO): Promise<UserDocument>;
  createUnconfirmedUserInstance(
    args: CreateUserDTO
  ): Promise<{ userDocument: UserDocument; confirmationCode: string }>;
};

export type UserMethodsType = {
  checkIsConfirmed(): boolean;
  checkIsConfirmationExpired(): boolean;
  confirmUser(): UserDocument;
  updateUserConfirmationData(): UserDocument;
  setPasswordRecoveryData(): UserDocument;
  checkIsRecoveryPasswordExist(): boolean;
  checkIsRecoveryPasswordExpired(): boolean;
  updateUserPassword(passwordHash: string): UserDocument;
};
