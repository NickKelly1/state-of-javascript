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

export const AuthGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = {
  // not required...
  // /**
  //  * Me?
  //  */
  // me: {
  //   type: GraphQLNonNull(MeGqlNode),
  //   resolve: async (parent, args, ctx): Promise<IMeGqlNodeSource> => {
  //     //
  //   },
  // },
};
