import { NpmsDashboardModel } from "../../circle";
import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";

export const NpmsPackageLang = {
  CannotAccess: {
    [Language.En]: `you cannot access npms-packages`,
    [Language.Ger]: '__TODO__',
  },

  CannotFindMany: {
    [Language.En]: `you cannot view npms-packages`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'npms-package not found',
    [Language.Ger]: '__TODO__',
  },

  CannotCreate: {
    [Language.En]: `you cannot create npms-packages`,
    [Language.Ger]: '__TODO__',
  },

  CannotUpdate: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot update npms-package "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSoftDelete: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete npms-package "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete npms-package "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot restore npms-package "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),
};