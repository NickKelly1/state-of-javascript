import { Language } from "../../common/i18n/consts/language.enum";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { IntegrationModel } from "./integration.model";

export const IntegrationLang = {
  CannotAccess: {
    [Language.En]: `you cannot access the integrations`,
    [Language.Ger]: '__TODO__',
  },

  CannotInitialise: (arg: { model: IntegrationModel }): LangSwitch => ({
    [Language.En]: `you cannot initialise integrations "${arg.model.name}"`,
    [Language.Ger]: '__TODO__',
  }),

  CannotFindMany: {
    [Language.En]: `you cannot view the integrations`,
    [Language.Ger]: '__TODO__',
  },

  NotFound: {
    [Language.En]: `integration not found`,
    [Language.Ger]: '__TODO__',
  },
};