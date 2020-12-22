import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import Joi from 'joi';

export interface IRequestVerificationEmailGqlInput {
  user_id: number;
}

export const RequestVerificationEmailGqlInput = new GraphQLInputObjectType({
  name: 'RequestVerificationEmail',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const RequestVerificationEmailGqlInputValidator = Joi.object<IRequestVerificationEmailGqlInput>({
  user_id: Joi.number().integer().positive(),
});
