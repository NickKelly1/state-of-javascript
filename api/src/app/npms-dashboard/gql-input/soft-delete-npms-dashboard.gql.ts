import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ISoftDeleteNpmsDashboardGqlInput {
  id: number;
}

export const SoftDeleteNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'SoftDeleteNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const SoftDeleteNpmsDashboardGqlInputValidator = Joi.object<ISoftDeleteNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
