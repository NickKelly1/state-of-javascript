import { Language } from "../consts/language.enum";

export const PermissionLang = {
  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `permission "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create permission',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update permission',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'permission not found',
    [Language.Ger]: '__TODO__',
  },
};