import Joi from 'joi';
import { UserModel } from '../../../circle';
import { UserDefinition } from '../user.definition';

export interface IUpdateUserDto {
  name?: string;
}

export const UpdateUserDto = Joi.object<IUpdateUserDto>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).optional(),
});
