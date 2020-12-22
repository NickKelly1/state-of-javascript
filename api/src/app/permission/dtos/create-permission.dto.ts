import Joi from 'joi';
import { PermissionDefinition } from '../permission.definition';

export interface ICreatePermissionDto {
  name: string;
}

export const CreatePermissionDto = Joi.object<ICreatePermissionDto>({
  name: Joi.string().min(PermissionDefinition.name.min).max(PermissionDefinition.name.max).required(),
});
