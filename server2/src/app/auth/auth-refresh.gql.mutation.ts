import { isLeft } from "fp-ts/lib/Either";
import { Thunk, GraphQLFieldConfigMap, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { UserModel } from "../../circle";
import { GqlContext } from "../../common/context/gql.context";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { LoginExpiredException } from "../../common/exceptions/types/login-expired.exception";
import { GqlNever } from "../../common/gql/gql.ever";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { ist } from "../../common/helpers/ist.helper";
import { toId } from "../../common/helpers/to-id.helper";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { ActionsGqlNode, IActionsGqlNodeSource } from "../actions/actions.gql.node";
import { RoleAssociation } from "../role/role.associations";
import { ICreateUserPasswordDto } from "../user-password/dtos/create-user-password.dto";
import { IUserServiceCreateUserDto } from "../user/service-dto/user-service.create-user.dto";
import { UserAssociation } from "../user/user.associations";
import { AuthenticationGqlNode, IAuthenticationGqlNodeSource, IAuthorisationRo } from "./gql-input/authorisation.gql";
import { LoginGqlInput, LoginGqlInputValidator } from "./gql-input/login.gql.input";
import { ILogoutGqlNodeSource, LogoutGqlNode } from "./gql/logout.gql.node";
import { RefreshGqlInput, RefreshGqlInputValidator } from "./gql-input/refresh.gql.input";
import { RegisterGqlInput, RegisterGqlInputValidator } from "./gql-input/register.gql.input";


/**
 * The Refresh path sits separate from all other GraphQL paths
 *
 * The refresh_token cookie is scoped off the main GraphQL routes
 * as to stop it from being sent with every request
 *
 * Because we still need a route that handles this request, we host
 * an additional GraphQL server on the refresh_token path explicitly
 * to refresh authentication...
 *
 * Note that the main graphql route also serves the refresh route,
 * but it must be provided via only request body, and cannot be provided by cookie
 */
export const AuthRefreshGqlMutation: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = {
  /**
   * Refresh authentication
   */
  refresh: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: RefreshGqlInput }},
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      let maybeIncomingRefresh: OrUndefined<string>;

      // from body
      const dto = ctx.validate(RefreshGqlInputValidator, args.dto);

      if (ist.notNullable(dto.refresh_token)) {
        maybeIncomingRefresh = dto.refresh_token;
      }

      // from cookies
      else {
        // from refresh
        const ref = ctx.http?.req.cookies.refresh_token;
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
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
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

        // grant public permissions...
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions();
        const auth = ctx.services.authService.authenticate({
          res: ctx.http?.res,
          permissions: permissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions.pub.map(toId)),
          user,
        })

        return ctx.services.authService.toAuthenticationGqlNodeSource({ auth, user });
      });

      return final;
    }
  },
};
