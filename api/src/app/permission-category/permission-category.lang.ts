import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { PermissionCategoryId } from "./permission-category-id.type";

export const PermissionCategoryLang = {
  CannotFindMany: {
    [Language.En]: `you cannot view permission-categories`,
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access permission-categories`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'permission-category not found',
    [Language.Ger]: '__TODO__',
  },

  IdsNotFound: (arg: { ids?: PermissionCategoryId[] }): LangSwitch => {
    const { ids } = arg;
    if (!ids?.length) {
      return {
        [Language.En]: 'permission-category not found',
        [Language.Ger]: '__TODO__',
      }
    }
    return {
      [Language.En]: `permission-categories "${ids.join('", "')}" not found`,
      [Language.Ger]: '__TODO__',
    }
  },
};