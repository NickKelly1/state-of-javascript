import { Language } from "../consts/language.enum";

export const AuthLang = {
  AccessExpired: (arg: { key: string }) => ({
    [Language.En]: `${arg.key} expired`,
    [Language.Ger]: '__TODO__',
  }),
};