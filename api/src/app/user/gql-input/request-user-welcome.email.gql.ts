import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import Joi from 'joi';

export interface IRequestWelcomeEmailGqlInput {
  user_id: number;
}

export const RequestWelcomeEmailGqlInput = new GraphQLInputObjectType({
  name: 'RequestWelcomeEmail',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const RequestWelcomeEmailGqlInputValidator = Joi.object<IRequestWelcomeEmailGqlInput>({
  user_id: Joi.number().integer().positive(),
});
