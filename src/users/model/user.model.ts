import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

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
      type: {
        confirmationCode: {
          type: String,
          required: true,
        },
        expirationDate: {
          type: Date,
          required: true,
        },
        isConfirmed: {
          type: Boolean,
          required: true,
        },
      },
      required: true,
    },
    passwordRecovery: {
      type: {
        recoveryCode: {
          type: String,
          required: true,
        },
        expirationDate: {
          type: Date,
          required: true,
        },
      },
      required: false,
    },
  },
  { collection: 'users' }
);

export type UserType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserType>;

export const UserModel = model<UserType>('user', userSchema);
