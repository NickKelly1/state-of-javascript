import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Joi from "joi";
import { OrNull } from "../../../common/types/or-null.type";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { IUserGqlNode, UserGqlNode } from "../../user/gql/user.gql.node";
import { UserDefinition } from "../../user/user.definition";
import { AccessTokenGqlObj, IAccessToken } from "../token/access.token.gql";
import { IRefreshToken, RefreshTokenGqlObj } from "../token/refresh.token.gql";

// ---------------
// ---- input ----
// ---------------

export interface ILoginGqlInput {
  name: string;
  password: string;
}

export const LoginGqlInputValidator = Joi.object<ILoginGqlInput>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});

export const LoginGqlInput = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
});

// ----------------
// ---- output ----
// ----------------

export interface ILoginGqlObj {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessToken;
  refresh_token_object: IRefreshToken;
  // user: OrNull<IUserGqlNode>;
}

export const LoginGqlObj = new GraphQLObjectType({
  name: 'LoginObject',
  fields: () => ({
    access_token: { type: GraphQLNonNull(GraphQLString) },
    refresh_token: { type: GraphQLNonNull(GraphQLString) },
    access_token_object: { type: GraphQLNonNull(AccessTokenGqlObj) },
    refresh_token_object: { type: GraphQLNonNull(RefreshTokenGqlObj) },
    // user: { type: UserGqlNode }
  }),
});
