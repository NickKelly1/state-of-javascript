import { RequestAuth } from "../classes/request-auth";
import { Exception } from "../exceptions/exception";
import { LangSwitch } from "../i18n/lange-match"

export interface IThrowable {
  (ctx: IRequestContext): Exception;
}

export interface IRequestContext {
  except(throwable: IThrowable): Exception;
  authorize(can: boolean): void | never;
  lang(switcher: LangSwitch): string;
  readonly auth: RequestAuth;
}