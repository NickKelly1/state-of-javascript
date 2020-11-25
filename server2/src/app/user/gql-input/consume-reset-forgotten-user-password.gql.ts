import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';

export interface IConsumeResetForgottenUserPasswordGqlInput {
  token: string;
  password: string;
}

export const ConsumeResetForgottenUserPasswordGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeResetForgottenUserPassword',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
    password: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeResetForgottenUserPasswordGqlInputValidator = Joi.object<IConsumeResetForgottenUserPasswordGqlInput>({
  token: Joi.string().required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
