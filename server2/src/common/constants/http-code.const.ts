import { StatusCodes } from 'http-status-codes';

export const HttpCode = {
  ...StatusCodes,
  UNAUTHENTICATED: 401,
} as const;
export type HttpCode = typeof HttpCode;
export type AHttpCode = HttpCode[keyof HttpCode];