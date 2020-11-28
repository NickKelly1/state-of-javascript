import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface IConsumeEmailVerificationGqlInput {
  token: string;
}

export const ConsumeEmailVerificationGqlInput = new GraphQLInputObjectType({
  name: 'ConsumeEmailVerification',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const ConsumeEmaiLVerificationGqlInputValidator = Joi.object<IConsumeEmailVerificationGqlInput>({
  token: Joi.string().required(),
});
