import { ist } from "../../helpers/ist.helper";
import { isu } from "../../helpers/isu.helper";
import { OrUndefined } from "../../types/or-undefined.type";
import { ALanguage, Language } from "../consts/language.enum";

export type LangSwitch = Record<ALanguage, OrUndefined<string>>

export function langMatch(languages: string[], switcher: LangSwitch): string {
  for (const language of languages) {
    if (isu.language(language)) {
      const phrase = switcher[language];
      if (ist.str(phrase)) return phrase;
    }
  }

  // use default
  const defaultLanguage = Language.En;
  const fallbackLanguage = defaultLanguage;
  const fallbackPhrase = switcher[fallbackLanguage];
  if (fallbackPhrase && ist.str(fallbackPhrase)) {
    return fallbackPhrase;
  }

  // ! Unhandled language...
  return '?';
}