import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IRequestResetForgottenUserPasswordGqlInput {
  email: string;
}

export const RequestResetForgottenUserPasswordGqlInput = new GraphQLInputObjectType({
  name: 'RequestResetForgottenUserPassword',
  fields: () => ({
    email: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const RequestResetForgottenUserPasswordGqlInputValidator = Joi.object<IRequestResetForgottenUserPasswordGqlInput>({
  email: Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).required(),
});
