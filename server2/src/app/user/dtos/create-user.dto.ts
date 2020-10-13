import Joi from 'joi';
import { UserModel } from '../../../circle';

export interface ICreateUserDto {
  first: string;
  last?: string;
}

export const CreateUserDto = Joi.object<ICreateUserDto>({
  first: Joi.string().min(3).max(20).required(),
  last: Joi.string().min(3).max(20).optional(),
});
