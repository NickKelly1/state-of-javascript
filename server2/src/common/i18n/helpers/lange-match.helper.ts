import { is } from "../../helpers/is.helper";
import { $TS_DANGER } from "../../types/$ts-danger.type";
import { OrUndefined } from "../../types/or-undefined.type";
import { LanguageDefault } from "../consts/language.default";
import { ALanguage, Language } from "../consts/language.enum";

export type LangSwitch = Record<ALanguage, OrUndefined<string>>

export function langMatch(languages: string[], switcher: LangSwitch): string {
  for (const language of languages) {
    if (is.language(language)) {
      const phrase = switcher[language];
      if (is.str(phrase)) return phrase;
    }
  }

  // use default
  const defaultLanguage = Language.En;
  const fallbackLanguage = defaultLanguage;
  const fallbackPhrase = switcher[fallbackLanguage];
  if (fallbackPhrase && is.str(fallbackPhrase)) {
    return fallbackPhrase;
  }

  // ! Unhandled language...
  return '?';
}