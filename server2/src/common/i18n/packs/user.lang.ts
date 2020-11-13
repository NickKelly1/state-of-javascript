import { Language } from "../consts/language.enum";

export const UserLang = {
  AlreadyExists: (arg: { name: string }) => ({
    [Language.En]: `user "${arg.name}" already exists`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenAddingRoles: (arg: { userName: string, roleNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to add roles of user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
    [Language.Ger]: '__TODO__',
  }),

  ForbiddenDeletingRoles: (arg: { userName: string, roleNames: string[] }) => ({
    [Language.En]: `Forbidden: unable to delete roles from user "${arg.userName}": "${arg.roleNames.join('", "')}"`,
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