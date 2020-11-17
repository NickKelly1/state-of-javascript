import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IUnpublishNpmsDashboardGqlInput {
  id: number;
}

export const UnpublishNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'UnpublishNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const UnpublishNpmsDashboardGqlInputValidator = Joi.object<IUnpublishNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
