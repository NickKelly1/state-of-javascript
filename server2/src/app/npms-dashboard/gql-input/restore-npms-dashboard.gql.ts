import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IRestoreNpmsDashboardGqlInput {
  id: number;
}

export const RestoreNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'RestoreNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const RestoreNpmsDashboardGqlInputValidator = Joi.object<IRestoreNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
