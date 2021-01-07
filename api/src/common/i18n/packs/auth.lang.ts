import { Language } from "../consts/language.enum";

export const AuthLang = {
  // actions
  CannotRegister: {
    [Language.En]: `you cannot register`,
    [Language.Ger]: '__TODO__',
  },

  CannotLogIn: {
    [Language.En]: `you cannot log-in`,
    [Language.Ger]: '__TODO__',
  },

  CannotLogInAsUser: {
    [Language.En]: `you cannot log-in as this user`,
    [Language.Ger]: '__TODO__',
  },

  //

  Unauthenticated: {
    [Language.En]: 'not authenticated',
    [Language.Ger]: '__TODO__',
  },

  NoRefreshToken: {
    [Language.En]: 'no refresh_token',
    [Language.Ger]: '__TODO__',
  },

  BadTokenType: {
    [Language.En]: `bad user-token-type`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInUserCannotLogIn: {
    [Language.En]: `this user cannot log in`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInIncorrectPassword: {
    [Language.En]: `incorrect password`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInUserNotFound: {
    [Language.En]: `user not found`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogIn: {
    [Language.En]: `failed to log in`,
    [Language.Ger]: '__TODO__',
  },

  FailedLogInAccountDeactivated: {
    [Language.En]: `account deactivated`,
    [Language.Ger]: '__TODO__',
  },

  NotLoggedIn: {
    [Language.En]: 'you are not logged in',
    [Language.Ger]: '__TODO__',
  },

  LoginRequired: {
    [Language.En]: 'you must be logged in',
    [Language.Ger]: '__TODO__',
  },

  LoginExpired: {
    [Language.En]: 'login expired',
    [Language.Ger]: '__TODO__',
  },


  AccessExpired: (arg: { key: string }) => ({
    [Language.En]: `${arg.key} expired`,
    [Language.Ger]: '__TODO__',
  }),
};