import { randomUUID } from 'crypto';

import { add } from 'date-fns';
import { Model, model, Schema } from 'mongoose';

import { CreateUserDTO } from './dto/create-user.dto';
import { UserMethodsType, UserStaticMethodsType, UserType } from './types/user.types';

type UserModelType = Model<UserType, unknown, UserMethodsType> & UserStaticMethodsType;

const emailConfirmationSchema = new Schema(
  {
    confirmationCode: {
      type: String,
      required: false,
      default: '',
    },
    expirationDate: {
      type: Date,
      required: false,
      default: null,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const passwordRecoverySchema = new Schema(
  {
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: false, default: null },
  },
  { _id: false }
);

const userSchema = new Schema<UserType, UserModelType, UserMethodsType>(
  {
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emailConfirmation: {
      type: emailConfirmationSchema,
      required: true,
    },
    passwordRecovery: {
      type: passwordRecoverySchema,
      required: false,
    },
  },
  { collection: 'users', versionKey: false }
);

userSchema.method('checkIsConfirmed', function checkIsConfirmed() {
  return this.emailConfirmation.isConfirmed;
});

userSchema.method('checkIsConfirmationExpired', function checkIsConfirmationExpired() {
  return (
    this.emailConfirmation.expirationDate && this.emailConfirmation.expirationDate < new Date()
  );
});

userSchema.method('confirmUser', function confirmUser() {
  this.emailConfirmation = {
    confirmationCode: '',
    expirationDate: null,
    isConfirmed: true,
  };

  return this;
});

userSchema.method('updateUserConfirmationData', function updateUserConfirmationData() {
  const confirmationCode = randomUUID();

  this.emailConfirmation = {
    isConfirmed: false,
    confirmationCode,
    expirationDate: add(new Date(), { hours: 1 }),
  };

  return this;
});

userSchema.method('setPasswordRecoveryData', function setPasswordRecoveryData() {
  const recoveryCode = randomUUID();

  this.passwordRecovery = {
    recoveryCode,
    expirationDate: add(new Date(), { hours: 1 }),
  };

  return this;
});

userSchema.method('checkIsRecoveryPasswordExist', function checkIsRecoveryPasswordExist() {
  return this.passwordRecovery;
});

userSchema.method('checkIsRecoveryPasswordExpired', function checkIsRecoveryPasswordExpired() {
  if (!this.passwordRecovery) {
    return true;
  }

  return this.passwordRecovery.expirationDate && this.passwordRecovery.expirationDate < new Date();
});

userSchema.method('updateUserPassword', function updateUserPassword(passwordHash: string) {
  this.passwordHash = passwordHash;

  return this;
});

userSchema.static(
  'checkIsUserExist',
  async function checkIsUserExist(args: {
    login: string;
    email: string;
  }): ReturnType<UserStaticMethodsType['checkIsUserExist']> {
    const [userLoginDocument, userEmailDocument] = await Promise.all([
      this.findOne({ login: args.login }).exec(),
      this.findOne({ email: args.email }).exec(),
    ]);

    if (userLoginDocument) {
      return { isExist: true, byField: 'login' };
    }

    if (userEmailDocument) {
      return { isExist: true, byField: 'email' };
    }

    return { isExist: false };
  }
);

userSchema.static(
  'createUserInstance',
  async function createUserInstance(
    args: CreateUserDTO
  ): ReturnType<UserStaticMethodsType['createUserInstance']> {
    const newUser = {
      login: args.login,
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: '',
        expirationDate: null,
      },
    };

    const userDocument = await this.create(newUser);

    return userDocument;
  }
);

userSchema.static(
  'createUnconfirmedUserInstance',
  async function createUnconfirmedUserInstance(
    args: CreateUserDTO
  ): ReturnType<UserStaticMethodsType['createUnconfirmedUserInstance']> {
    const confirmationCode = randomUUID();

    const newUser = {
      login: args.login,
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }),
      },
    };

    const userDocument = await this.create(newUser);

    return { userDocument, confirmationCode };
  }
);

export const UserModel = model<UserType, UserModelType>('user', userSchema);
