import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { NpmsDashboardItemDefinition } from '../npms-dashboard-item.definition';

export interface IUpdateNpmsDashboardItemInput {
  id: number;
  name?: string;
}

export const UpdateNpmsDashboardItemGqlInput = new GraphQLInputObjectType({
  name: 'UpdateNpmsDashboardItem',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
  }),
})

export const UpdateNpmsDashboardItemValidator = Joi.object<IUpdateNpmsDashboardItemInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(NpmsDashboardItemDefinition.name.min).max(NpmsDashboardItemDefinition.name.max).optional(),
});
