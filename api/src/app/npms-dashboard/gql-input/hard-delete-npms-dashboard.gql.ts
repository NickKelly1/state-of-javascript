import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IHardDeleteNpmsDashboardGqlInput {
  id: number;
}

export const HardDeleteNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'HardDeleteNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const HardDeleteNpmsDashboardGqlInputValidator = Joi.object<IHardDeleteNpmsDashboardGqlInput>({
  id: Joi.number().integer().positive().required(),
});
