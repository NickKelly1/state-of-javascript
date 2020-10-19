import { Language } from "../consts/language.enum";

export const QueryLang = {
  InvalidFilterOperator: (arg: { op: string }) => ({
    [Language.En]: `Invalid filter oprerator "${arg.op}"`,
    [Language.Ger]: '__TODO__',
  }),
  InvalidSortDirection: (arg: { dir: string | number }) => ({
    [Language.En]: `Invalid sort direction "${arg.dir}"`,
    [Language.Ger]: '__TODO__',
  }),
  InvalidFilterOption: (arg: { opt: string }) => ({
    [Language.En]: `Invalid filter option "${arg.opt}"`,
    [Language.Ger]: '__TODO__',
  }),
}