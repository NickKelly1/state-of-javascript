import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface IConsumeVerifyEmailChangeGqlInput {
  token: string;
}

export const ConsumeVerifyEmailChangeGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeVerifyEmailChange',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeVerifyEmailChangeGqlInputValidator = Joi.object<IConsumeVerifyEmailChangeGqlInput>({
  token: Joi.string().required(),
});
