import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Joi from "joi";
import { OrNull } from "../../../common/types/or-null.type";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { IUserGqlDataSource, UserGqlData } from "../../user/gql/user.gql.data";
import { UserDefinition } from "../../user/user.definition";
import { AccessTokenGqlObj, IAccessToken } from "../token/access.token.gql";
import { IRefreshToken, RefreshTokenGqlObj } from "../token/refresh.token.gql";

// ---------------
// ---- input ----
// ---------------

export interface ISignupDto {
  name: string;
  email: string;
  password: string;
}

export const SignupDtoValidator = Joi.object<ISignupDto>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  email: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});


// ----------------
// ---- output ----
// ----------------

export interface ISignupRo {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessToken;
  refresh_token_object: IRefreshToken;
}
