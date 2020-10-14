import Joi from 'joi';
import { RolePermissionModel } from '../../../circle';
import { PermissionId } from '../../permission/permission-id.type';
import { RoleId } from '../../role/role.id.type';
import { RolePermissionDefinition } from '../role-permission.definition';

export interface ICreateRolePermissionDto {
  role_id: RoleId;
  permission_id: PermissionId;
}

export const CreateRolePermissionDto = Joi.object<ICreateRolePermissionDto>({
  role_id: Joi.number().integer().positive().required(),
  permission_id: Joi.number().integer().positive().required(),
});
