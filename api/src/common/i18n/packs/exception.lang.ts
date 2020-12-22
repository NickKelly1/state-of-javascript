import { Language } from "../consts/language.enum";
import { LangSwitch } from "../helpers/lange-match.helper";

export const ExceptionLang = {
  BadRequest: {
    [Language.En]: 'bad request',
    [Language.Ger]: '__TODO__',
  },

  PathNotFound: (arg: { path: string }): LangSwitch => ({
    [Language.En]: `${arg.path} not found`,
    [Language.Ger]: '__TODO__',
  }),

  NotFound: {
    [Language.En]: 'not found',
    [Language.Ger]: '__TODO__',
  },

  Forbidden: {
    [Language.En]: 'forbidden',
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