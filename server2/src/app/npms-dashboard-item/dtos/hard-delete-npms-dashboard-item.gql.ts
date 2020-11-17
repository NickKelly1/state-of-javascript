import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IHardDeleteNpmsDashboardItemInput {
  id: number;
}

export const HardDeleteNpmsDashboardItemGqlInput = new GraphQLInputObjectType({
  name: 'HardDeleteNpmsDashboardItem',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const HardDeleteNpmsDashboardItemValidator = Joi.object<IHardDeleteNpmsDashboardItemInput>({
  id: Joi.number().integer().positive().required(),
});
