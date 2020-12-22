import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';

export interface IConsumeResetPasswordTokenGqlInput {
  token: string;
  password: string;
}

export const ConsumeResetPasswordTokenGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeResetPasswordToken',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
    password: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeResetPasswordTokenGqlInputValidator = Joi.object<IConsumeResetPasswordTokenGqlInput>({
  token: Joi.string().required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});
