import Joi from 'joi';
import { RoleModel } from '../../../circle';
import { RoleDefinition } from '../role.definition';

export interface ICreateRoleDto {
  name: string;
}

export const CreateRoleDto = Joi.object<ICreateRoleDto>({
  name: Joi.string().min(RoleDefinition.name.min).max(RoleDefinition.name.max).required(),
});
