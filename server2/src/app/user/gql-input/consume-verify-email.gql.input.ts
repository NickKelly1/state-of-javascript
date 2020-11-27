import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface IConsumeVerifyEmailGqlInput {
  token: string;
}

export const ConsumeVerifyEmailGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeVerifyEmail',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeVerifyEmailGqlInputValidator = Joi.object<IConsumeVerifyEmailGqlInput>({
  token: Joi.string().required(),
});
