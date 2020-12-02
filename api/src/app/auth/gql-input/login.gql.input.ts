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
    Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max),
    Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).email(),
  ).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});

// gql

export interface ILoginGqlInput {
  name_or_email: string;
  password: string;
}

export const LoginGqlInput = new GraphQLInputObjectType({
  name: 'Login',
  fields: () => ({
    name_or_email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
});

export const LoginGqlInputValidator = Joi.object<ILoginGqlInput>({
  name_or_email: Joi.alternatives(
    Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max),
    Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).email(),
  ).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});