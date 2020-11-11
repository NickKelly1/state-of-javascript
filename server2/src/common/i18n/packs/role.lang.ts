import { Language } from "../consts/language.enum";

export const RoleLang = {
  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `role "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenAddingPermissions: (arg: { roleName: string, permisionNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to add permissions of role "${arg.roleName}": "${arg.permisionNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenDeletingPermissions: (arg: { roleName: string, permisionNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to delete permissions from role "${arg.roleName}": "${arg.permisionNames.join('", "')}"`,
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