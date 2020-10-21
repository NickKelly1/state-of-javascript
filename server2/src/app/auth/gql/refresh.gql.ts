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
import { IUserGqlNode, UserGqlNode } from "../../user/gql/user.gql.node";
import { OrNull } from "../../../common/types/or-null.type";

// ---------------
// ---- input ----
// ---------------

export interface IRefreshGqlInput {
  refresh_token: string;
}

export const RefreshGqlInputValidator = Joi.object<IRefreshGqlInput>({
  refresh_token: Joi.string().required(),
});

export const RefreshGqlInput = new GraphQLInputObjectType({
  name: 'RefreshInput',
  fields: () => ({
    refresh_token: { type: GraphQLNonNull(GraphQLString) },
  }),
});

// ----------------
// ---- output ----
// ----------------

export interface IRefreshGqlObj {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessToken;
  refresh_token_object: IRefreshToken;
  // user: OrNull<IUserGqlNode>;
}

export const RefreshGqlObj = new GraphQLObjectType({
  name: 'RefreshObject',
  fields: () => ({
    access_token: { type: GraphQLNonNull(GraphQLString) },
    refresh_token: { type: GraphQLNonNull(GraphQLString) },
    access_token_object: { type: GraphQLNonNull(AccessTokenGqlObj) },
    refresh_token_object: { type: GraphQLNonNull(RefreshTokenGqlObj) },
    // user: { type: UserGqlNode }
  }),
});

