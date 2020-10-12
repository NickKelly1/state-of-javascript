import { is } from "../helpers/is.helper";
import { $TS_DANGER } from "../types/$ts-danger.type";
import { OrUndefined } from "../types/or-undefined.type";
import { LanguageDefault } from "./consts/language.default";
import { ALanguage, Language } from "./consts/language.enum";



// option
export interface ILangOptionCtx {
  language: ALanguage;
}

export interface ILangOptionFn {
  (ctx: ILangOptionCtx): string;
}

export type ILangOption = (string | ILangOptionFn);


// options
export type ILangOptions = {
  [L in ALanguage]?: OrUndefined<ILangOption>;
}


// handler
export interface ILangHandlerCtx {
  languages: string[];
}

export interface ILangHandler {
  (ctx: ILangHandlerCtx): string;
}

export function langSwitch(options: ILangOptions): ILangHandler {
  return function usingLanguage(langCtx): string {
    const { languages } = langCtx;

    for (const language of languages) {
      if (is.language(language)) {
        const optionCtx: ILangOptionCtx = { language };
        let phrase = options[language];
        if (!phrase) { phrase = options[LanguageDefault]; }
        if (is.fn(phrase)) return phrase(optionCtx);
        if (is.str(phrase)) return phrase;
      }
    }

    // ! Unhandled language...
    return '?';
  }
}