import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IApproveNpmsDashboardGqlInput {
  id: number;
}

export const ApproveNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'ApproveNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const ApproveNpmsDashboardGqlInputValidator = Joi.object<IApproveNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
