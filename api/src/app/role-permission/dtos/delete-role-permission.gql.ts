import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import Joi from 'joi';

export interface IDeleteRolePermissionInput {
  role_permission_id: number;
}

export const DeleteRolePermissionGqlInput = new GraphQLInputObjectType({
  name: 'DeleteRolePermission',
  fields: () => ({
    role_permission_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const DeleteRolePermissionValidator = Joi.object<IDeleteRolePermissionInput>({
  role_permission_id: Joi.number().integer().positive().required(),
});
