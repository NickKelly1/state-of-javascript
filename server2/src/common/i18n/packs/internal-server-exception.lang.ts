import { Language } from "../consts/language.enum";

export const InternalServerExceptionLang = {
  RunnerNotInitialised: {
    [Language.En]: 'GraphQL Query Runner not initialised',
    [Language.Ger]: '__TODO__',
  },
  RunnerAlreadyInitialised: {
    [Language.En]: 'GraphQL Query Runner is already initialised',
    [Language.Ger]: '__TODO__',
  },
  // for when we fail to find unique user...
  FailedToFindUser: {
    [Language.En]: 'Failed to find user',
    [Language.Ger]: '__TODO__',
  },
}