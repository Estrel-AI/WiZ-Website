export type AuthSession = {
  userId: string;
  token: string;
};

export type GenerateOtpRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type BusinessSignupPayload = {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  org_name: string;
  org_address: string;
  tax_id: string;
  contact_number: string;
  plan: string;
  otp: string;
  email_verified_token?: string;
};

export type AuthApiResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

