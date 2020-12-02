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
import { AuthRefreshGqlMutation } from "./auth-refresh.gql.mutation";
import { AuthenticationGqlNode, IAuthenticationGqlNodeSource, IAuthorisationRo } from "./gql-input/authorisation.gql";
import { LoginGqlInput, LoginGqlInputValidator } from "./gql-input/login.gql.input";
import { ILogoutGqlNodeSource, LogoutGqlNode } from "./gql/logout.gql.node";
import { RefreshGqlInput, RefreshGqlInputValidator } from "./gql-input/refresh.gql.input";
import { RegisterGqlInput, RegisterGqlInputValidator } from "./gql-input/register.gql.input";
import { IMeGqlNodeSource, MeGqlNode } from "./gql-input/me.gql";


export const AuthGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = {
  ...AuthRefreshGqlMutation,

  /**
   * Register
   */
  register: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: RegisterGqlInput } },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canRegister());
      const dto = ctx.validate(RegisterGqlInputValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const userServiceDto: IUserServiceCreateUserDto = {
          name: dto.name,
          email: dto.email,
          verified: false,
          deactivated: false,
        };
        const user = await ctx.services.userService.create({
          runner,
          dto: userServiceDto,
        });
        const userPasswordServiceDto: ICreateUserPasswordDto = {
          password: dto.password
        };
        await ctx.services.userPasswordService.create({
          runner,
          user,
          dto: userPasswordServiceDto,
        });

        // grant public permissions...
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions();
        const auth = ctx.services.authService.authenticate({
          res: ctx.http?.res,
          permissions: systemPermissions.authenticated.map(toId)
            .concat(...systemPermissions.pub.map(toId)),
          user,
        });

        // send registration email
        await ctx.services.userService.sendRegistrationEmail({ model: user, runner });

        return ctx.services.authService.toAuthenticationGqlNodeSource({ auth, user });
      });

      return final;
    },
  },


  /**
   * Login
   */
  login: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: LoginGqlInput } },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      // verify can log in at all
      ctx.authorize(ctx.services.userPolicy.canLogin());
      const dto = ctx.validate(LoginGqlInputValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findOneFromNameEmail({
          nameOrEmail: dto.name_or_email,
          unscoped: true,
          runner,
          options: {
            include: [
              { association: UserAssociation.password, },
              {
                association: UserAssociation.roles,
                include: [
                  { association: RoleAssociation.permissions, },
                ],
              },
            ],
          },
        });

        // user not matched
        if (!user) {
          const message = ctx.lang(ExceptionLang.FailedLogInUserNotFound);
          throw ctx.except(BadRequestException({ message, data: { name_or_email: [message] } }));
        }

        // verify can log in as user
        ctx.authorize(ctx.services.userPolicy.canLoginAs({ model: user }));

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

        // grant permissions...
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions();
        const auth = ctx.services.authService.authenticate({
          user,
          res: ctx.http?.res,
          permissions: permissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions.pub.map(toId)),
        })

        return ctx.services.authService.toAuthenticationGqlNodeSource({ auth, user });
      });

      return final;
    },
  },


  /**
   * Logout
   */
  logout: {
    type: GraphQLNonNull(LogoutGqlNode),
    resolve: (parent, args, ctx): ILogoutGqlNodeSource => {
      ctx.services.authService.unauthenticate({ res: ctx.http?.res });
      return GqlNever;
    }
  },
};
