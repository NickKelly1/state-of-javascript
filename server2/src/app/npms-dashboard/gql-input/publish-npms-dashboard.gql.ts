import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IPublishNpmsDashboardGqlInput {
  id: number;
}

export const PublishNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'PublishNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const PublishNpmsDashboardGqlInputValidator = Joi.object<IPublishNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
