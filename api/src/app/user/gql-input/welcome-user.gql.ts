import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IConsumeUserWelcomeGqlInput {
  token: string;
  name: string;
  password: string;
}

export const ConsumeUserWelcomeGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeUserWelcome',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
    name: { type: GraphQLNonNull(GraphQLString), },
    password: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeUserWelcomeGqlInputValidator = Joi.object<IConsumeUserWelcomeGqlInput>({
  token: Joi.string().required(),
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
