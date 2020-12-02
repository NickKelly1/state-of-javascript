import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IRejectNpmsDashboardGqlInput {
  id: number;
}

export const RejectNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'RejectNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const RejectNpmsDashboardGqlInputValidator = Joi.object<IRejectNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
