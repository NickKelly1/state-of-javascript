import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IRequestUserEmailChangeGqlInput {
  user_id: number;
  email: string;
}

export const RequestUserEmailChangeGqlInput = new GraphQLInputObjectType({
  name: 'RequestEmailChange',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    email: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const RequestUserEmailChangeGqlInputValidator = Joi.object<IRequestUserEmailChangeGqlInput>({
  user_id: Joi.number().integer().positive(),
  email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).optional(),
});
