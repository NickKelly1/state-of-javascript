import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserDefinition } from '../user.definition';

export interface IRequestUserEmailChangeEmailGqlInput {
  user_id: number;
  email: string;
}

export const RequestEmailChangeEmailGqlInput = new GraphQLInputObjectType({
  name: 'RequestEmailChangeEmail',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    email: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const RequestUserEmailChangeEmailGqlInputValidator = Joi.object<IRequestUserEmailChangeEmailGqlInput>({
  user_id: Joi.number().integer().positive(),
  email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).optional(),
});
