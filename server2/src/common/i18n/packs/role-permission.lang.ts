import { RoleModel, PermissionModel  } from "../../../circle";
import { Language } from "../consts/language.enum";

export const RolePermissionLang = {
  AlreadyExists: (arg: {  role: RoleModel, permission: PermissionModel, }) => ({
    [Language.En]: `role "${arg.role.name}" already has permission "${arg.permission.name}"`,
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