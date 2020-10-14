import { StatusCodes } from 'http-status-codes';

export const HttpCode = {
  ...StatusCodes,
  UNAUTHENTICATED: 401,
  // https://stackoverflow.com/questions/1653493/what-http-status-code-is-supposed-to-be-used-to-tell-the-client-the-session-has
  LOGIN_EXPIRED: 440,
} as const;
export type HttpCode = typeof HttpCode;
export type AHttpCode = HttpCode[keyof HttpCode];