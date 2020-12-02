import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import Joi from "joi";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";
import { IAccessToken } from "../token/access.token.gql";
import { IRefreshToken } from "../token/refresh.token.gql";


export interface IRegisterGqlInput {
  name: string;
  email: string;
  password: string;
}


export const RegisterGqlInput = new GraphQLInputObjectType({
  name: 'Register',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
});

export const RegisterGqlInputValidator = Joi.object<IRegisterGqlInput>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  email: Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).email().required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});