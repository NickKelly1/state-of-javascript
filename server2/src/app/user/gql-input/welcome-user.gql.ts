import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IAcceptUserWelcomeGqlInput {
  token: string;
  name: string;
  password: string;
}

export const AcceptUserWelcomeGqlInput = new GraphQLInputObjectType({
  name: 'AcceptUserWelcome',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
    name: { type: GraphQLNonNull(GraphQLString), },
    password: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const AcceptUserWelcomeGqlInputValidator = Joi.object<IAcceptUserWelcomeGqlInput>({
  token: Joi.string().required(),
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
