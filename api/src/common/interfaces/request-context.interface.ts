import Joi from "joi";
import { PermissionId } from "../../app/permission/permission-id.type";
import { UserId } from "../../app/user/user.id.type";
import { UserModel } from "../../app/user/user.model";
import { RequestAuth } from "../classes/request-auth";
import { Exception } from "../exceptions/exception";
import { LangSwitch } from "../i18n/helpers/lange-match.helper"
import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";
import { IJson } from "./json.interface";
import { IRequestServices } from "./request.services.interface";

export interface IRequestContext {
  // duck-type some RequestAuth methods
  isSuperAdmin(): boolean;
  isMe(user?: OrNullable<UserModel>): boolean;
  isMeById(id?: OrNullable<UserId>): boolean;
  hasPermission(...permissions: (PermissionId | PermissionId[])[]): boolean;
  authorize(can: boolean): void | never;
  lang(switcher: LangSwitch): string;
  info(): IJson;
  readonly auth: RequestAuth;
  readonly services: IRequestServices;
  validate<T>(validator: Joi.ObjectSchema<T>, obj: unknown): T;
  assertAuthentication(): UserId;
  assertFound<T>(arg: OrNullable<T>): T;
}
