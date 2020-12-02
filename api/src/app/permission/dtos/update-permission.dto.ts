import Joi from 'joi';
import { PermissionModel } from '../../../circle';
import { PermissionDefinition } from '../permission.definition';

export interface IUpdatePermissionDto {
  name?: string;
}

export const UpdatePermissionDto = Joi.object<IUpdatePermissionDto>({
  name: Joi.string().min(PermissionDefinition.name.min).max(PermissionDefinition.name.max).optional(),
});
