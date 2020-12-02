import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import Joi from "joi";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";
import { IAccessToken } from "../token/access.token.gql";
import { IRefreshToken } from "../token/refresh.token.gql";

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
  email: Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).email().required(),
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
