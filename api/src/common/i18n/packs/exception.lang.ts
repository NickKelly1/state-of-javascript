import { Language } from "../consts/language.enum";

export const ExceptionLang = {
  BadTokenType: {
    [Language.En]: `Bad UserTokenType`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInUserCannotLogIn: {
    [Language.En]: `Failed to log in: this user cannot log in`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInIncorrectPassword: {
    [Language.En]: `Failed to log in: incorrect password`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInUserNotFound: {
    [Language.En]: `Failed to log in: user not found`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogIn: {
    [Language.En]: `Failed to log in`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInAccountDeactivated: {
    [Language.En]: `Failed to log in: account deactivated`,
    [Language.Ger]: '__TODO__',
  },

  LoginExpired: {
    [Language.En]: 'login expired',
    [Language.Ger]: '__TODO__',
  },

  BadRequest: {
    [Language.En]: 'bad request',
    [Language.Ger]: '__TODO__',
  },

  NoRefreshToken: {
    [Language.En]: 'no refresh_token',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'not found',
    [Language.Ger]: '__TODO__',
  },

  Forbidden: {
    [Language.En]: 'Forbidden',
    [Language.Ger]: '__TODO__',
  },

  Unauthenticated: {
    [Language.En]: 'not authenticated',
    [Language.Ger]: '__TODO__',
  },

  InternalException: {
    [Language.En]: 'Internal Server Exception',
    [Language.Ger]: 'Interne Serverausnahme',
  },

  InvalidAccessToken: {
    [Language.En]: 'Invalid access token',
    [Language.Ger]: 'Interne Serverausnahme',
  },

  InvalidRefreshToken: {
    [Language.En]: 'Invalid access token',
    [Language.Ger]: 'Interne Serverausnahme',
  },
}