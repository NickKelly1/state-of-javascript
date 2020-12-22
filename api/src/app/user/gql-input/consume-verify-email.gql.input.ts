import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface IConsumeEmailVerificationTokenGqlInput {
  token: string;
}

export const ConsumeEmailVerificationTokenGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeEmailVerificationToken',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeEmailVerificationTokenGqlInputValidator = Joi.object<IConsumeEmailVerificationTokenGqlInput>({
  token: Joi.string().required(),
});
