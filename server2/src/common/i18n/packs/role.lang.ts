import { Language } from "../consts/language.enum";

export const RoleLang = {
  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `role "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create role',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update role',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'role not found',
    [Language.Ger]: '__TODO__',
  },
};