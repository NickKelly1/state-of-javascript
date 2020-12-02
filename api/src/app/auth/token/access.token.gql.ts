import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Joi from "joi";
import { GqlContext } from "../../../common/context/gql.context";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionId } from "../../permission/permission-id.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { UserId } from "../../user/user.id.type";

export interface IAccessTokenData { user_id: UserId; permissions: PermissionId[]; }

export interface IAccessToken extends IAccessTokenData, IWithIat {}
export const AccessTokenValidator = Joi.object<IAccessToken>({
  user_id: Joi.number().integer().positive().required(),
  permissions: Joi.array().items(Joi.number().integer().positive()).required(),
  iat: Joi.number().integer().positive().required(),
  exp: Joi.number().integer().positive().required(),
});
