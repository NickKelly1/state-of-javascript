import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { NpmsDashboardDefinition } from '../npms-dashboard.definition';

export interface ICreateNpmsDashboardInput {
  name: string;
  npms_package_ids: OrNullable<number[]>;
}

export const CreateNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'CreateNpmsDashboard',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
    npms_package_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), }
  }),
})

export const CreateNpmsDashboardValidator = Joi.object<ICreateNpmsDashboardInput>({
  name: Joi.string().min(NpmsDashboardDefinition.name.min).max(NpmsDashboardDefinition.name.max).required(),
  npms_package_ids: Joi.array().items(Joi.number().positive().integer().required()).optional(),
});
