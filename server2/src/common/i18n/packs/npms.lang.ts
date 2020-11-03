import { Language } from "../consts/language.enum";

export const NpmsLang = {
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