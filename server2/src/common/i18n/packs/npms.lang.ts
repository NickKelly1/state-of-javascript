import { Language } from "../consts/language.enum";

export const NpmsLang = {
  AlreadyExists: (arg: { names: string[] }) => ({
    [Language.En]: `npms names "${arg.names.join('", "')}" already exists`,
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