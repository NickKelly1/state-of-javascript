import Joi from 'joi';
import { UserModel } from '../../../circle';
import { UserDefinition } from '../user.definition';

export interface ICreateUserDto {
  name: string;
}

export const CreateUserDto = Joi.object<ICreateUserDto>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
});
