import { isLeft } from "fp-ts/lib/Either";
import Joi from "joi";
import { UserId } from "../../app/user/user.id.type";
import { BadRequestException } from "../exceptions/types/bad-request.exception";
import { ForbiddenException } from "../exceptions/types/forbidden.exception";
import { UnauthenticatedException } from "../exceptions/types/unauthenticated.exception";
import { ist } from "../helpers/ist.helper";
import { validate } from "../helpers/validate.helper";
import { LangSwitch } from "../i18n/helpers/lange-match.helper";
import { ExceptionLang } from "../i18n/packs/exception.lang";
import { IJson } from "../interfaces/json.interface";
import { IRequestServices } from "../interfaces/request.services.interface";
import { Loader } from "../classes/loader";
import { RequestAuth } from "../classes/request-auth";
import { OrNullable } from "../types/or-nullable.type";
import { NotFoundException } from "../exceptions/types/not-found.exception";
import { UserModel } from "../../app/user/user.model";
import { PermissionId } from "../../app/permission/permission-id.type";
import { AuthLang } from "../i18n/packs/auth.lang";

export abstract class BaseContext {
  abstract readonly auth: RequestAuth;
  abstract readonly services: IRequestServices;
  abstract info(): IJson;
  abstract lang(switcher: LangSwitch): string;

  protected _loader?: Loader;
  public get loader(): Loader {
    if (this._loader) return this._loader;
    this._loader = new Loader({ ctx: this, });
    return this._loader;
  }

  /**
   * Does the Context have Super Admin permissions?
   */
  isSuperAdmin(): boolean {
    return this.auth.isSuperAdmin();
  }

  /**
   * Is a given User the Requester?
   *
   * @param user
   */
  isMe(user?: OrNullable<UserModel>): boolean {
    return this.auth.isMe(user);
  }


  /**
   * Does a given UserId belong to the Requester?
   *
   * @param id
   */
  isMeById(id?: OrNullable<UserId>): boolean {
    return this.auth.isMeById(id);
  }

  /**
   * Does the request have any of the following permissions?
   *
   * @param permissions
   */
  hasPermission(...permissions: (PermissionId | PermissionId[])[]): boolean {
    return this.auth.hasPermission(...permissions);
  }

  /**
   * Throw 403 if can't
   *
   * @param can
   */
  authorize(can: boolean, message: LangSwitch): void | never {
    if (!can) {
      let msg = undefined;
      msg = this.lang(message);
      throw new ForbiddenException(msg);
    }
  }


  /**
   * Throw 404 if nullable
   *
   * @param arg
   */
  assertFound<T>(arg: OrNullable<T>, message?: string | LangSwitch): T {
    if (!arg) {
      let msg = undefined;
      if (typeof message === 'string') msg = message;
      else if (typeof message === 'object' && msg) msg = this.lang(message);
      throw new NotFoundException(msg);
    }
    return arg;
  }

  /**
   * Validate an object
   *
   * @param validator
   * @param obj
   */
  validate<T>(validator: Joi.ObjectSchema<T>, obj: unknown): T {
    const validation = validate(validator, obj);
    if (isLeft(validation)) {
      const message = this.lang(ExceptionLang.BadRequest);
      throw new BadRequestException(message, validation.left);
    }
    return validation.right;
  }

  /**
   * Assert that the request is authenticated
   */
  assertAuthentication(): UserId {
    const user_id = this.auth.user_id;
    if (ist.nullable(user_id)) {
      const message = this.lang(AuthLang.LoginRequired);
      throw new UnauthenticatedException(message);
    }
    return user_id;
  }
}
