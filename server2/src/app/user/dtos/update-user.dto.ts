import Joi from 'joi';
import { UserModel } from '../../../circle';

export interface IUpdateUserDto {
  first?: string;
  last?: string;
}

export const UpdateUserDto = Joi.object<IUpdateUserDto>({
  first: Joi.string().min(3).max(20).optional(),
  last: Joi.string().min(3).max(20).optional(),
});
