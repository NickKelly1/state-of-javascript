import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ISubmitNpmsDashboardGqlInput {
  id: number;
}

export const SubmitNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'SubmitNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const SubmitNpmsDashboardGqlInputValidator = Joi.object<ISubmitNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
