import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';
import { NpmsPackageId } from '../../npms-package/npms-package.id.type';

export interface ICreateNpmsDashboardItemInput {
  dashboard_id: number;
  npms_package_id: NpmsPackageId;
}

export const CreateNpmsDashboardItemGqlInput = new GraphQLInputObjectType({
  name: 'CreateNpmsDashboardItem',
  fields: () => ({
    dashboard_id: { type: GraphQLNonNull(GraphQLInt), },
    npms_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const CreateNpmsDashboardItemValidator = Joi.object<ICreateNpmsDashboardItemInput>({
  dashboard_id: Joi.number().integer().positive(),
  npms_package_id: Joi.number().integer().positive(),
});
