import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IConsumeWelcomeTokenGqlInput {
  token: string;
  name: string;
  password: string;
}

export const ConsumeWelcomeTokenGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeWelcomeToken',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
    name: { type: GraphQLNonNull(GraphQLString), },
    password: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeWelcomeTokenGqlInputValidator = Joi.object<IConsumeWelcomeTokenGqlInput>({
  token: Joi.string().required(),
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
