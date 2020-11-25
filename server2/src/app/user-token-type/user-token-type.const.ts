
export const UserTokenType = {
  ForgottenPasswordReset: 10,
  VerifyEmail: 20,
  AcceptWelcome: 30,
} as const;
export type UserTokenType = typeof UserTokenType;
export type AUserTokenType = UserTokenType[keyof UserTokenType];