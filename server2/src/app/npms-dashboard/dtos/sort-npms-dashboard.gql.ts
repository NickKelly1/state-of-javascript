import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';

export interface ISortNpmsDashboardInput {
  dashboard_ids: number[];
}

export const SortNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'SortNpmsDashboard',
  fields: () => ({
    dashboard_ids: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))), },
  }),
})

export const SortNpmsDashboardValidator = Joi.object<ISortNpmsDashboardInput>({
  dashboard_ids: Joi.array().items(Joi.number().positive().integer().required()).required(),
});
