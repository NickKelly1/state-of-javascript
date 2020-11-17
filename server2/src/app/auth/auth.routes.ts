import { Router } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { Op } from "sequelize";
import { ExpressContext } from "../../common/classes/express-context";
import { HttpCode } from "../../common/constants/http-code.const";
import { Exception } from "../../common/exceptions/exception";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { InternalServerException } from "../../common/exceptions/types/internal-server.exception";
import { LoginExpiredException } from "../../common/exceptions/types/login-expired.exception";
import { NotFoundException } from "../../common/exceptions/types/not-found.exception";
import { UnauthenticatedException } from "../../common/exceptions/types/unauthenticated.exception";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { ist } from "../../common/helpers/ist.helper";
import { mw } from "../../common/helpers/mw.helper";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { UserLang } from "../../common/i18n/packs/user.lang";
import { JsonResponder } from "../../common/responses/json.responder";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { RoleAssociation } from "../role/role.associations";
import { ICreateUserPasswordDto } from "../user-password/dtos/create-user-password.dto";
import { IUserServiceCreateUserDto } from "../user/service-dto/user-service.create-user.dto";
import { UserAssociation } from "../user/user.associations";
import { IAuthorisationRo } from "./gql/authorisation.gql";
import { LoginDtoValidator } from "./gql/login.gql";
import { RefreshDtoValidator } from "./gql/refresh.gql";
import { SignupDtoValidator } from "./gql/signup.dto";

export function AuthRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();


  // TODO: can't get gql routes to do cookies across ports for some reason... (maybe b/c wasn't fetch-ing with creds...)
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/signup', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { res } = ctx;
    ctx.authorize(ctx.services.userPolicy.canRegister());
    const dto = ctx.body(SignupDtoValidator);

    const { user } = await ctx.services.universal.db.transact(async ({ runner }) => {
      const userDto: IUserServiceCreateUserDto = {
        name: dto.name,
        email: dto.email,
        verified: false,
        deactivated: false,
      };
      const user = await ctx.services.userService.create({ runner, dto: userDto, });
      const passwordDto: ICreateUserPasswordDto = { password: dto.password };
      await ctx.services.userPasswordService.create({ runner, user, dto: passwordDto });
      return { user };
    });

    // grant public permissions...
    const publicAuth = await ctx.services.universal.publicAuthorisation.retrieve();
    const auth = ctx.services.authService.authenticate({
      res,
      permissions: publicAuth.permissions.map(perm => perm.id),
      user,
    });

    return new JsonResponder(HttpCode.OK, auth);
  }));

  router.post('/signout', mw<JsonResponder<null>>(async (ctx, next) => {
    const { req, res } = ctx;
    ctx.services.authService.unauthenticate({ res })
    return new JsonResponder(HttpCode.OK, null);
  }));


  // gql routes can't do cookies across ports for some reason...
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/signin', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { res } = ctx;
    const dto = ctx.body(LoginDtoValidator);

    const { user, roles, permissions } = await ctx.services.universal.db.transact(async ({ runner }) => {
      const user = await ctx.services.userRepository.findOneFromNameEmail({
        nameOrEmail: dto.name_or_email,
        unscoped: true,
        runner,
        options: {
          include: [
            { association: UserAssociation.password, },
            {
              association: UserAssociation.roles,
              include: [{
                association: RoleAssociation.permissions,
              }],
            },
          ],
        },
      });

      // user not matched
      if (!user) {
        const message = ctx.lang(ExceptionLang.FailedLogInUserNotFound);
        throw ctx.except(BadRequestException({ message, data: { name_or_email: [message] } }));
      }

      const roles = assertDefined(user.roles);
      const permissions = assertDefined(roles.flatMap(role => assertDefined(role.permissions)));

      // user is deactivated
      if (user.isDeactivated()) {
        const message = ctx.lang(ExceptionLang.FailedLogInAccountDeactivated);
        throw ctx.except(BadRequestException({ message, }));
      }

      // user has no password (can't log in)
      const password = user.password;
      if (!password) {
        const message = ctx.lang(ExceptionLang.FailedLogInUserCannotLogIn);
        throw ctx.except(BadRequestException({ message, }));
      }

      // password didn't match
      const same = await ctx.services.userPasswordService.compare({ password, raw: dto.password, });
      if (!same) {
        const message = ctx.lang(ExceptionLang.FailedLogInIncorrectPassword);
        throw ctx.except(BadRequestException({ message, }));
      }

      // success
      return { user: user, roles, permissions, };
    });

    // grant public permissions...
    const publicAuth = await ctx.services.universal.publicAuthorisation.retrieve();
    const auth = ctx.services.authService.authenticate({
      user,
      res,
      permissions: Array.from(new Set(permissions.concat(publicAuth.permissions).map(perm => perm.id))),
    })

    return new JsonResponder(HttpCode.OK, auth);
  }));


  // this can't be a gql route
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/refresh', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { req, res } = ctx;
    let maybeIncomingRefresh: OrUndefined<string>;

    // from body
    const dto = ctx.body(RefreshDtoValidator);
    if (ist.notNullable(dto.refresh_token)) {
      maybeIncomingRefresh = dto.refresh_token;
    }

    // from cookies
    else {
      // from refresh
      const ref = req.cookies.refresh_token;
      if (ist.notNullable(ref)) maybeIncomingRefresh = ref;
    }

    // no token
    if (!maybeIncomingRefresh) {
      throw ctx.except(BadRequestException({ message: ctx.lang(ExceptionLang.NoRefreshToken) }));
    }

    // decode
    const maybeValidatedRefresh = ctx.services.jwtService.decodeRefreshToken({ token: maybeIncomingRefresh });
    if (isLeft(maybeValidatedRefresh)) { throw maybeValidatedRefresh.left; }
    const receivedRefresh = maybeValidatedRefresh.right;

    // check expiry
    if (ctx.services.jwtService.isExpired(receivedRefresh)) {
      throw ctx.except(LoginExpiredException());
    }

    // success - do refresh
    const { user, roles, permissions } = await ctx.services.universal.db.transact(async ({ runner }) => {
      const user = await ctx.services.userRepository.findByPkOrfail(receivedRefresh.user_id, {
        runner,
        options: {
          include: [{
            association: UserAssociation.roles,
            include: [{
              association: RoleAssociation.permissions,
            }],
          }],
        },
      });
      const roles = assertDefined(user.roles);
      const permissions = assertDefined(roles.flatMap(role => assertDefined(role.permissions)));
      return { user, roles, permissions, };
    });

    // deactivated?
    if (user.isDeactivated()) {
      const message = ctx.lang(ExceptionLang.FailedLogInAccountDeactivated);
      throw ctx.except(UnauthenticatedException({ message }));
    }

    // grant public permissions...
    const publicAuth = await ctx.services.universal.publicAuthorisation.retrieve();
    const auth = ctx.services.authService.authenticate({
      res,
      permissions: Array.from(new Set(permissions.concat(publicAuth.permissions).map(perm => perm.id))),
      user,
    })

    return new JsonResponder(HttpCode.OK, auth);
  }));

  return router;
}