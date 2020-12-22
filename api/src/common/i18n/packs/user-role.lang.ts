import { Language } from "../consts/language.enum";
import { LangSwitch } from "../helpers/lange-match.helper";

export const UserRoleLang = {
  NotFound: {
    [Language.En]: 'user-role not found',
    [Language.Ger]: '__TODO__',
  },

  CannotFindMany: {
    [Language.En]: `you cannot view user-roles`,
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access user-roles`,
    [Language.Ger]: '__TODO__',
  },

  AlreadyExists: (arg: { user: string | number, role: string | number }): LangSwitch => ({
    [Language.En]: `user "${arg.user}" already has role "${arg.role}"`,
    [Language.Ger]: '__TODO__',
  }),
};