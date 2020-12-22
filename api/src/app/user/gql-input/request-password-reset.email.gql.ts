import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserDefinition } from '../user.definition';

export interface IRequestPasswordResetEmailGqlInput {
  email: string;
}

export const RequestPasswordResetEmailGqlInput = new GraphQLInputObjectType({
  name: 'RequestPasswordResetEmail',
  fields: () => ({
    email: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const RequestPasswordResetGqlInputValidator = Joi.object<IRequestPasswordResetEmailGqlInput>({
  email: Joi.string().min(UserDefinition.email.min).max(UserDefinition.email.max).required(),
});
