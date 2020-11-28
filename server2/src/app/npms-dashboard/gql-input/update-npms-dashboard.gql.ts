import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { NpmsPackageDefinition } from '../../npms-package/npms-package.definition';
import { NpmsDashboardDefinition } from '../npms-dashboard.definition';

export interface IUpdateNpmsDashboardInput {
  id: number;
  name?: string;
  npms_package_ids?: OrNullable<number[]>;
  npms_package_names?: OrNullable<string[]>;
}

export const UpdateNpmsDashboardGqlInput = new GraphQLInputObjectType({
  name: 'UpdateNpmsDashboard',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
    npms_package_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
    npms_package_names: { type: GraphQLList(GraphQLNonNull(GraphQLString)), },
  }),
})

export const UpdateNpmsDashboardValidator = Joi.object<IUpdateNpmsDashboardInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(NpmsDashboardDefinition.name.min).max(NpmsDashboardDefinition.name.max).optional(),
  npms_package_ids: Joi.array().items(Joi.number().positive().integer().required()).optional(),
  npms_package_names: Joi.array().items(Joi.string().min(NpmsPackageDefinition.name.min).max(NpmsPackageDefinition.name.max).required()).optional(),
});
