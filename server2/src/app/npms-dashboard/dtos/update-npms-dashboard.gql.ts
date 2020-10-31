import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { NpmsDashboardDefinition } from '../npms-dashboard.definition';

export interface IUpdateNpmsDashboardInput {
  id: number;
  name?: string;
}

export const UpdateNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'UpdateNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
  }),
})

export const UpdateNpmsDashboardValidator = Joi.object<IUpdateNpmsDashboardInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(NpmsDashboardDefinition.name.min).max(NpmsDashboardDefinition.name.max).optional(),
});
