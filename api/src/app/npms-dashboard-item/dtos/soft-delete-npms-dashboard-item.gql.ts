import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ISoftDeleteNpmsDashboardItemInput {
  id: number;
}

export const SoftDeleteNpmsDashboardItemGqlInput = new GraphQLInputObjectType({
  name: 'SoftDeleteNpmsDashboardItem',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const SoftDeleteNpmsDashboardItemValidator = Joi.object<ISoftDeleteNpmsDashboardItemInput>({
  id: Joi.number().integer().positive().required(),
});
