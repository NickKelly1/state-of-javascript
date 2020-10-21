import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Joi from "joi";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { PermissionId } from "../../permission/permission-id.type";
import { UserId } from "../../user/user.id.type";

export interface IAccessTokenData { user_id: UserId; permissions: PermissionId[]; }
export interface IAccessToken extends IAccessTokenData, IWithIat {}
export const AccessTokenValidator = Joi.object<IAccessToken>({
  user_id: Joi.number().integer().positive().required(),
  permissions: Joi.array().items(Joi.number().integer().positive()).required(),
  iat: Joi.number().integer().positive().required(),
  exp: Joi.number().integer().positive().required(),
});
export const AccessTokenGqlObj = new GraphQLObjectType({
  name: 'AccessTokenObject',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt) },
    permissions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))) },
    iat: { type: GraphQLNonNull(GraphQLString) },
    exp: { type: GraphQLNonNull(GraphQLString) },
  }),
});
