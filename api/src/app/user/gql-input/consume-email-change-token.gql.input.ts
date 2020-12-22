import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface IConsumeVerifyEmailChangeGqlInput {
  token: string;
}

export const ConsumeEmailChangeTokenGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeEmailChangeToken',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeEmailChangeTokenGqlInputValidator = Joi.object<IConsumeVerifyEmailChangeGqlInput>({
  token: Joi.string().required(),
});
