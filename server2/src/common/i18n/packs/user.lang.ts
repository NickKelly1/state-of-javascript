import { Language } from "../consts/language.enum";

export const UserLang = {
  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `user "${arg.name}" already exists`,
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