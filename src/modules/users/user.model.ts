import { Model, model, Schema } from 'mongoose';

import { UserType } from '../../users/model';

import { UserStaticMethodsType } from './types/user.types';

type UserModelType = Model<UserType> & UserStaticMethodsType;

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

const userSchema = new Schema<UserType, UserModelType>(
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
  async function createUserInstance(args: {
    login: string;
    email: string;
    passwordHash: string;
  }): ReturnType<UserStaticMethodsType['createUserInstance']> {
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

export const UserModel = model<UserType, UserModelType>('user', userSchema);
