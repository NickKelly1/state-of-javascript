import { Language } from "../consts/language.enum";

export const NpmsLang = {
  NpmsNamesNotFound: (arg: { names: string[] }) => ({
    [Language.En]: `Npm packages: ${arg.names.join('", "')}" not found`,
    [Language.Ger]: '__TODO__',
  }),

  NpmsIdsNotFound: (arg: { ids: number[] }) => ({
    [Language.En]: `Npms ids: ${arg.ids.join('", "')}" not found`,
    [Language.Ger]: '__TODO__',
  }),

  AlreadyExists: (arg: { names: string[] }) => ({
    [Language.En]: `"${arg.names.join('", "')}" ${arg.names.length > 1 ? 'are' : 'is' } already linked`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create user',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update user',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'user not found',
    [Language.Ger]: '__TODO__',
  },
};