import Joi from 'joi';
import { UserRoleModel } from '../../../circle';
import { RoleId } from '../../role/role.id.type';
import { UserId } from '../../user/user.id.type';
import { UserRoleDefinition } from '../user-role.definition';

export interface ICreateUserRoleDto {
  role_id: RoleId;
  user_id: UserId;
}

export const CreateUserRoleDto = Joi.object<ICreateUserRoleDto>({
  role_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
});
