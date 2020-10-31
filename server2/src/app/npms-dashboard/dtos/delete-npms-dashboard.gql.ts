import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IDeleteNpmsDashboardInput {
  id: number;
}

export const DeleteNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'DeleteNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const DeleteNpmsDashboardValidator = Joi.object<IDeleteNpmsDashboardInput>({
  id: Joi.number().integer().positive().required(),
});
