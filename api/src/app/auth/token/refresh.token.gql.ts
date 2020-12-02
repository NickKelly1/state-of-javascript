import { GraphQLInt, GraphQLString } from "graphql";
import { GraphQLNonNull, GraphQLObjectType } from "graphql/type/definition";
import Joi from "joi";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { UserId } from "../../user/user.id.type";

export interface IRefreshTokenData {
  user_id: UserId;
}

export interface IRefreshToken extends IRefreshTokenData, IWithIat {}

export const RefreshTokenValidator = Joi.object<IRefreshToken>({
  user_id: Joi.number().integer().positive().required(),
  iat: Joi.number().integer().positive().required(),
  exp: Joi.number().integer().positive().required(),
});
