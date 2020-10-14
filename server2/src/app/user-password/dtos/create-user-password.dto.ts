import Joi from 'joi';
import { UserModel } from '../../../circle';

export interface ICreateUserPasswordDto {
  password: string;
}
