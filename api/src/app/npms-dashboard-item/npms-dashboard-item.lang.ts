import { NpmsDashboardModel, NpmsPackageModel } from "../../circle";
import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";

export const NpmsDashboardItemLang = {
  CannotFindMany: {
    [Language.En]: `you cannot view npms-dashboard-items`,
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access npms-dashboard-items`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'npms-dashboard-item not found',
    [Language.Ger]: '__TODO__',
  },

  CannotCreate: (arg: { dashboard: NpmsDashboardModel; npmsPackage: NpmsPackageModel; }): LangSwitch => ({
    [Language.En]: `you cannot create npms-dashboard-items for ${arg.dashboard.name} and ${arg.npmsPackage.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { dashboard: NpmsDashboardModel; npmsPackage: NpmsPackageModel; }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete npms-dashboard-items for ${arg.dashboard.name} and ${arg.npmsPackage.name}`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { dashboard: NpmsDashboardModel; npmsPackage: NpmsPackageModel; }): LangSwitch => ({
    [Language.En]: `you cannot restore npms-dashboard-items for ${arg.dashboard.name} and ${arg.npmsPackage.name}`,
    [Language.Ger]: '__TODO__',
  }),
};