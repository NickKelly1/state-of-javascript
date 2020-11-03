import Joi from "joi";
import { UserId } from "../../app/user/user.id.type";
import { RequestAuth } from "../classes/request-auth";
import { Exception } from "../exceptions/exception";
import { LangSwitch } from "../i18n/helpers/lange-match.helper"
import { OrNullable } from "../types/or-nullable.type";
import { IJson } from "./json.interface";
import { IRequestServices } from "./request.services.interface";
import { IUniversalServices } from "./universal.services.interface";

export interface IThrowable {
  (ctx: IRequestContext): Exception;
}

export interface IRequestContext {
  except(throwable: IThrowable): Exception;
  authorize(can: boolean): void | never;
  lang(switcher: LangSwitch): string;
  info(): IJson;
  readonly auth: RequestAuth;
  readonly services: IRequestServices;
  validate<T>(validator: Joi.ObjectSchema<T>, obj: unknown): T;
  assertAuthentication(): UserId;
  assertFound<T>(arg: OrNullable<T>): T;
}
