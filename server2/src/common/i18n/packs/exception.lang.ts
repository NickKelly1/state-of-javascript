import { Language } from "../consts/language.enum";

export const ExceptionLang = {
  LoginExpired: {
    [Language.En]: 'login expired',
    [Language.Ger]: '__TODO__',
  },

  BadRequest: {
    [Language.En]: 'bad request',
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