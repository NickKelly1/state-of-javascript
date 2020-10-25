import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Joi from "joi";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { PermissionId } from "../../permission/permission-id.type";
import { UserId } from "../../user/user.id.type";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";
import { AccessTokenGqlObj, IAccessToken } from "../token/access.token.gql";
import { IRefreshToken, RefreshTokenGqlObj } from "../token/refresh.token.gql";
import { IUserGqlDataSource, UserGqlData } from "../../user/gql/user.gql.data";
import { OrNull } from "../../../common/types/or-null.type";

// ---------------
// ---- input ----
// ---------------

export interface IRefreshGqlInput {
  refresh_token?: string;
}

export const RefreshGqlInputValidator = Joi.object<IRefreshGqlInput>({
  refresh_token: Joi.string(),
});

export const RefreshGqlInput = new GraphQLInputObjectType({
  name: 'RefreshInput',
  fields: () => ({
    refresh_token: { type: GraphQLNonNull(GraphQLString) },
  }),
});
