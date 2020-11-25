import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import Joi from "joi";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";

// ---------------
// ---- input ----
// ---------------

export interface ILoginDto {
  name_or_email: string;
  password: string;
}

export const LoginDtoValidator = Joi.object<ILoginDto>({
  name_or_email: Joi.alternatives(
    // name
    Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max),
    // email
    Joi.string().email().min(UserDefinition.name.min).max(UserDefinition.name.max),
  ).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
