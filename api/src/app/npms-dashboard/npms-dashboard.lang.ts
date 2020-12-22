import { NpmsDashboardModel } from "../../circle";
import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";

export const NpmsDashboardLang = {
  CannotFindMany: {
    [Language.En]: `you cannot view npms-dashboards`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: 'npms-dashboard not found',
    [Language.Ger]: '__TODO__',
  },

  CannotAccess: {
    [Language.En]: `you cannot access npms-dashoards`,
    [Language.Ger]: '__TODO__',
  },

  CannotSort: {
    [Language.En]: `you cannot sort npms-dashoards`,
    [Language.Ger]: '__TODO__',
  },

  CannotCreate: {
    [Language.En]: `you cannot create npms-dashoards`,
    [Language.Ger]: '__TODO__',
  },

  CannotUpdate: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot update npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSoftDelete: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot soft-delete npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotHardDelete: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot hard-delete npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotRestore: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot restore npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotSubmit: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot submit npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotReject: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot reject npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotApprove: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot approve npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotPublish: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot publish npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotUnpublish: (arg: { model: NpmsDashboardModel }): LangSwitch => ({
    [Language.En]: `you cannot unpublish npms-dashboard "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  NoAuthentication: {
    [Language.En]: `you must either be logged in or provide a shad_id`,
    [Language.Ger]: '__TODO__',
  },

  NpmsNamesNotFound: (arg: { names: string[] }) => ({
    [Language.En]: `npm packages: ${arg.names.join('", "')}" not found`,
    [Language.Ger]: '__TODO__',
  }),

  NpmsIdsNotFound: (arg: { ids: number[] }) => ({
    [Language.En]: `npms ids: ${arg.ids.join('", "')}" not found`,
    [Language.Ger]: '__TODO__',
  }),

  AlreadyExists: (arg: { names: string[] }) => ({
    [Language.En]: `"${arg.names.join('", "')}" ${arg.names.length > 1 ? 'are' : 'is' } already linked`,
    [Language.Ger]: '__TODO__',
  }),
};