import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IDeleteNpmsDashboardItemInput {
  id: number;
}

export const DeleteNpmsDashboardItemGqlInput = new GraphQLInputObjectType({
  name: 'DeleteNpmsDashboardItem',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const DeleteNpmsDashboardItemValidator = Joi.object<IDeleteNpmsDashboardItemInput>({
  id: Joi.number().integer().positive().required(),
});
