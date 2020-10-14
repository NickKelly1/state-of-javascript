import { RequestAuth } from "../classes/request-auth";
import { Exception } from "../exceptions/exception";
import { LangSwitch } from "../i18n/helpers/lange-match.helper"
import { OrNullable } from "../types/or-nullable.type";
import { IJson } from "./json.interface";
import { IServices } from "./services.interface";

export interface IThrowable {
  (ctx: IRequestContext): Exception;
}

export interface IRequestContext {
  except(throwable: IThrowable): Exception;
  authorize(can: boolean): void | never;
  lang(switcher: LangSwitch): string;
  info(): IJson;
  readonly auth: RequestAuth;
  readonly services: IServices;
}