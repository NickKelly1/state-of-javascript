import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { NpmsDashboardDefinition } from '../npms-dashboard.definition';

export interface ICreateNpmsDashboardInput {
  name: string;
}

export const CreateNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'CreateNpmsDashboard',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
  }),
})

export const CreateNpmsDashboardValidator = Joi.object<ICreateNpmsDashboardInput>({
  name: Joi.string().min(NpmsDashboardDefinition.name.min).max(NpmsDashboardDefinition.name.max).required(),
});
