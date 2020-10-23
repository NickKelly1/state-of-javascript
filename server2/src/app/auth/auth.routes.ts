import { Router } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { Op } from "sequelize";
import { ExpressContext } from "../../common/classes/express-context";
import { HttpCode } from "../../common/constants/http-code.const";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { LoginExpiredException } from "../../common/exceptions/types/login-expired.exception";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { ist } from "../../common/helpers/ist.helper";
import { mw } from "../../common/helpers/mw.helper";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { JsonResponder } from "../../common/responses/json.responder";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { RoleAssociation } from "../role/role.associations";
import { ICreateUserPasswordDto } from "../user-password/dtos/create-user-password.dto";
import { ICreateUserDto } from "../user/dtos/create-user.dto";
import { UserAssociation } from "../user/user.associations";
import { UserField } from "../user/user.attributes";
import { IAuthorisationRo } from "./gql/authorisation.gql";
import { LoginGqlInputValidator } from "./gql/login.gql";
import { RefreshGqlInputValidator } from "./gql/refresh.gql";
import { SignupGqlInputValidator } from "./gql/signup.gql";

export function AuthRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();


  // gql routes can't do cookies across ports for some reason...
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/signup', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { res } = ctx;
    const dto = ctx.body(SignupGqlInputValidator);

    const { user } = await ctx.services.dbService().transact(async ({ runner }) => {
      const userDto: ICreateUserDto = { name: dto.name };
      const user = await ctx.services.userService().create({ runner, dto: userDto, });
      const passwordDto: ICreateUserPasswordDto = { password: dto.password };
      const password = await ctx.services.userPasswordService().create({ runner, user, dto: passwordDto });
      return { user };
    });

    const auth = ctx.services.authService().authenticate({
      res,
      permissions: [],
      user,
    });

    return new JsonResponder(HttpCode.OK, auth);
  }));

  router.post('/signout', mw<JsonResponder<null>>(async (ctx, next) => {
    const { req, res } = ctx;
    ctx.services.authService().unauthenticate({ res })
    return new JsonResponder(HttpCode.OK, null);
  }));


  // gql routes can't do cookies across ports for some reason...
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/signin', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { res } = ctx;
    const dto = ctx.body(LoginGqlInputValidator);

    const { user, roles, permissions } = await ctx.services.dbService().transact(async ({ runner }) => {
      const user = await ctx.services.userRepository().findOneOrfail({
        runner,
        options: {
          where: { [UserField.name]: { [Op.eq]: dto.name } },
          include: [
            { association: UserAssociation.password, },
            {
              association: UserAssociation.roles,
              include: [{
                association: RoleAssociation.permissions,
              }],
            }
        ],
        },
      });
      const roles = assertDefined(user.roles);
      const permissions = assertDefined(roles.flatMap(role => assertDefined(role.permissions)));

      const password = user.password;
      if (!password) {
        throw ctx.except(BadRequestException({ message: ctx.lang(ExceptionLang.CannotLogIn({ user: user.name, })), }));
      }
      const same = await ctx.services.userPasswordService().compare({ password, raw: dto.password, });
      if (!same) { throw ctx.except(BadRequestException({ message: ctx.lang(ExceptionLang.IncorrectPassword), })); }
      return { user, roles, permissions, };
    });

    const auth = ctx.services.authService().authenticate({
      user,
      res,
      permissions: permissions.map(perm => perm.id),
    })

    return new JsonResponder(HttpCode.OK, auth);
  }));



  // this can't be a gql route
  // since we scope the refresh_token cookie to /v1/auth/refresh
  router.post('/refresh', mw<JsonResponder<IAuthorisationRo>>(async (ctx, next) => {
    const { req, res } = ctx;
    let maybeIncomingRefresh: OrUndefined<string>;

    // from body
    const dto = ctx.body(RefreshGqlInputValidator);
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
    const maybeValidatedRefresh = ctx.services.jwtService().decodeRefreshToken({ token: maybeIncomingRefresh });
    if (isLeft(maybeValidatedRefresh)) { throw maybeValidatedRefresh.left; }
    const receivedRefresh = maybeValidatedRefresh.right;

    // check expiry
    if (ctx.services.jwtService().isExpired(receivedRefresh)) {
      throw ctx.except(LoginExpiredException());
    }

    // success - do refresh
    const { user, roles, permissions } = await ctx.services.dbService().transact(async ({ runner }) => {
      const user = await ctx.services.userRepository().findByPkOrfail(receivedRefresh.user_id, {
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

    const auth = ctx.services.authService().authenticate({
      res,
      permissions: permissions.map(perm => perm.id),
      user,
    })

    return new JsonResponder(HttpCode.OK, auth);
  }));

  return router;
}