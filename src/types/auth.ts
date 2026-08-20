export type AuthApiPayload = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type SignupRequest = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  plan: string;
  recaptcha_token: string;
  otp?: string;
  login_type?: "social";
};

export type SigninRequest = {
  username: string;
  password: string;
  recaptcha_token: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type GenerateOtpRequest = {
  email: string;
};

export type UserRegisteredResponse = AuthApiPayload & {
  status?: string;
  registered?: boolean;
  exists?: boolean;
  data?: {
    status?: string;
    registered?: boolean;
    exists?: boolean;
  };
};
