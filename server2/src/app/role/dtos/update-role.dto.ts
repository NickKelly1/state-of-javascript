import Joi from 'joi';
import { RoleModel } from '../../../circle';
import { RoleDefinition } from '../role.definition';

export interface IUpdateRoleDto {
  name?: string;
}

export const UpdateRoleDto = Joi.object<IUpdateRoleDto>({
  name: Joi.string().min(RoleDefinition.name.min).max(RoleDefinition.name.max).optional(),
});
