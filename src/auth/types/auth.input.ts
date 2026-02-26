export type LoginInputType = {
  loginOrEmail: string;
  password: string;
};
export type RegistrationInputType = {
  login: string;
  password: string;
  email: string;
};
export type RegistrationConfirmationInputType = {
  code: string;
};

export type RegistrationEmailResendingType = Pick<RegistrationInputType, 'email'>;
export type PasswordRecoveryType = Pick<RegistrationInputType, 'email'>;

export type NewPasswordInputType = {
  newPassword: string;
  recoveryCode: string;
};
