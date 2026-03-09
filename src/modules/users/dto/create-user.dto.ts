export type CreateUserDTO = {
  login: string;
  email: string;
  passwordHash: string;
};

export type CreateUserRequestDTO = {
  login: string;
  email: string;
  password: string;
};
