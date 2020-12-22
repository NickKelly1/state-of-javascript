import { Language } from "../../common/i18n/consts/language.enum";

export const RolePermissionLang = {
  NotFound: {
    [Language.En]: 'role-permission not found',
    [Language.Ger]: '__TODO__',
  },

  CannotFindMany: {
    [Language.En]: `you cannot view role-permissions`,
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access role-permissions`,
    [Language.Ger]: '__TODO__',
  },

  CannotCreate: {
    [Language.En]: `you cannot create role-permissions`,
    [Language.Ger]: '__TODO__',
  },

  CannotHardDelete: {
    [Language.En]: `you cannot hard-delete this role-permissions`,
    [Language.Ger]: '__TODO__',
  },

  AlreadyExists: (arg: {  role: string | number, permission: string | number, }) => ({
    [Language.En]: `role "${arg.role}" already has permission "${arg.permission}"`,
    [Language.Ger]: '__TODO__',
  }),
};