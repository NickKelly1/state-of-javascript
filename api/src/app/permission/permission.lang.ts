import { PermissionId } from "./permission-id.type";
import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";

export const PermissionLang = {
  CannotAccess: {
    [Language.En]: `you cannot access permissions`,
    [Language.Ger]: '__TODO__',
  },

  CannotFindMany: {
    [Language.En]: `you cannot view permissions`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'permission not found',
    [Language.Ger]: '__TODO__',
  },

  IdsNotFound: (arg: { ids?: PermissionId[] }): LangSwitch => {
    const { ids } = arg;
    if (!ids?.length) {
      return {
        [Language.En]: 'permission not found',
        [Language.Ger]: '__TODO__',
      }
    }
    return {
      [Language.En]: `permissions "${ids.join('", "')}" not found`,
      [Language.Ger]: '__TODO__',
    }
  },
};
