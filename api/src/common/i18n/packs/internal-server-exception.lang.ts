import { UserTokenType } from "../../../app/user-token-type/user-token-type.const";
import { UserTokenTypeId } from "../../../app/user-token-type/user-token-type.id.type";
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
  UnhandledUserLinkType: (arg: { type_id: UserTokenTypeId }) => ({
    [Language.En]: `Unhandled UserLinkType: "${arg.type_id}"`,
    [Language.Ger]: '__TODO__',
  }),
  TransactionAlreadyCommitted: {
    [Language.En]: `The transaction has already been committed`,
    [Language.Ger]: '__TODO__',
  }
}