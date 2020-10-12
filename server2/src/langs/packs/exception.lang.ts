import { is } from "../../helpers/is.helper";
import { OrUndefined } from "../../types/or-undefined.type";
import { Language } from "../consts/language.enum";
import { Lang } from "../lang"
import { ILangHandler, ILangOptionCtx, langSwitch } from "../lange-switch.fn";

export const ExceptionLang = {
  NotFound: (arg?: { name?: string }): ILangHandler => {
    const name = arg?.name;
    return langSwitch({
      [Language.En]: () => {
        if (name) return `${name} not found`;
        return `Not found`;
      },
      [Language.Ger]: () => {
        if (name) return `${name} nicht gefunden`;
        return `Nicht gefunden`;
      },
    })
  },

  InternalException: (arg?: {}): ILangHandler => {
    return langSwitch({
      [Language.En]: () => `Internal Server Exception`,
      [Language.Ger]: () => `Interne Serverausnahme`,
    })
  },
}