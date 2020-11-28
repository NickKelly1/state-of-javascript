
export const UserTokenType = {
  ForgottenPasswordReset: 10,
  AcceptWelcome: 20,
  VerifyEmail: 30,
  VerifyEmailChange: 40,
} as const;
export type UserTokenType = typeof UserTokenType;
export type AUserTokenType = UserTokenType[keyof UserTokenType];