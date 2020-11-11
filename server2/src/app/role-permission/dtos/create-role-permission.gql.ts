import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';
import { RolePermissionModel } from '../../../circle';
import { PermissionId } from '../../permission/permission-id.type';
import { RoleId } from '../../role/role.id.type';
import { RolePermissionDefinition } from '../role-permission.definition';

export interface ICreateRolePermissionInput {
  role_id: RoleId;
  permission_id: PermissionId;
}

export const CreateRolePermissionGqlInput = new GraphQLInputObjectType({
  name: 'CreateRolePermissionGqlInput',
  fields: () => ({
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    permission_id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const CreateRolePermissionValidator = Joi.object<ICreateRolePermissionInput>({
  role_id: Joi.number().integer().positive().required(),
  permission_id: Joi.number().integer().positive().required(),
});
