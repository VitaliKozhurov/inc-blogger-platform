import { HydratedDocument, model, Schema, Types } from 'mongoose';

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

const userSchema = new Schema(
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

type EmailConfirmation = {
  confirmationCode: string;
  expirationDate?: Date | null;
  isConfirmed: boolean;
};

type PasswordRecovery = {
  recoveryCode: string;
  expirationDate?: Date | null;
};

export type UserType = {
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  emailConfirmation: EmailConfirmation;
  passwordRecovery?: PasswordRecovery;
} & { _id: Types.ObjectId };

export type UserDocument = HydratedDocument<UserType>;

export const UserModel = model<UserType>('user', userSchema);
