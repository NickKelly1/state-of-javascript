import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IRequestUserWelcomeGqlInput {
  user_id: number;
}

export const RequestUserWelcomeGqlInput = new GraphQLInputObjectType({
  name: 'RequestUserWelcome',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const RequestUserWelcomeGqlInputValidator = Joi.object<IRequestUserWelcomeGqlInput>({
  user_id: Joi.number().integer().positive(),
});
