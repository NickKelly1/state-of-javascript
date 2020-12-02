import { RoleModel, PermissionModel  } from "../../../circle";
import { Language } from "../consts/language.enum";

export const RolePermissionLang = {
  AlreadyExists: (arg: {  role: string | number, permission: string | number, }) => ({
    [Language.En]: `role "${arg.role}" already has permission "${arg.permission}"`,
    [Language.Ger]: '__TODO__',
  }),

  FailedToCreate: {
    [Language.En]: 'failed to create role permission',
    [Language.Ger]: '__TODO__',
  },

  FailedToUpdate: {
    [Language.En]: 'failed to update role permission',
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'role permission not found',
    [Language.Ger]: '__TODO__',
  },
};