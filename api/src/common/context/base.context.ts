import { isLeft } from "fp-ts/lib/Either";
import Joi from "joi";
import { UserId } from "../../app/user/user.id.type";
import { Exception } from "../exceptions/exception";
import { BadRequestException } from "../exceptions/types/bad-request.exception";
import { ForbiddenException } from "../exceptions/types/forbidden.exception";
import { UnauthenticatedException } from "../exceptions/types/unauthenticated.exception";
import { ist } from "../helpers/ist.helper";
import { validate } from "../helpers/validate.helper";
import { LangSwitch } from "../i18n/helpers/lange-match.helper";
import { ExceptionLang } from "../i18n/packs/exception.lang";
import { IJson } from "../interfaces/json.interface";
import { IRequestContext, IThrowable } from "../interfaces/request-context.interface";
import { IRequestServices } from "../interfaces/request.services.interface";
import { Loader } from "../classes/loader";
import { RequestAuth } from "../classes/request-auth";
import { OrNullable } from "../types/or-nullable.type";
import { NotFoundException } from "../exceptions/types/not-found.exception";
import { UserModel } from "../../app/user/user.model";
import { PermissionId } from "../../app/permission/permission-id.type";

export abstract class BaseContext implements IRequestContext {
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
  authorize(can: boolean): void | never {
    if (!can) {
      // TODO: not required any more? remove...
      // // 401 if not authenticated (allows front-end to logout the user)
      // if (!this.auth.isAuthenticatedAsUser()) { throw this.except(UnauthenticatedException()) }
      // 403 if authenticated
      throw this.except(ForbiddenException())
    };
  }

  /**
   * Throw 404 if nullable
   *
   * @param arg
   */
  assertFound<T>(arg: OrNullable<T>): T {
    if (!arg) throw this.except(NotFoundException());
    return arg;
  }

  /**
   * Create an Exception
   *
   * @param throwable
   */
  except(throwable: IThrowable): Exception {
    const exception = throwable(this);
    exception.shiftTrace(2);
    // if 403 but unauthenticated, switch to 401... (naughty but lets us notify frontend of expired creds)
    if (!this.auth.isLoggedIn() && exception.code === 403) {
      exception.switchCodeTo(401);
    }
    return exception;
  }

  /**
   * Validate an object
   * Throw 401 BadRequestException otherwise
   *
   * @param validator
   * @param obj
   */
  validate<T>(validator: Joi.ObjectSchema<T>, obj: unknown): T {
    const validation = validate(validator, obj);
    if (isLeft(validation)) {
      throw this.except(BadRequestException({
        error: this.lang(ExceptionLang.BadRequest),
        data: validation.left,
      }));
    }
    return validation.right;
  }

  /**
   * Assert that the request is authenticated
   */
  assertAuthentication(): UserId {
    const user_id = this.auth.user_id;
    if (ist.nullable(user_id)) {
      throw this.except(UnauthenticatedException());
    }
    return user_id;
  }
}