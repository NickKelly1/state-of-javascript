import Joi from 'joi';
import { UserModel } from '../../../circle';

export interface IUpdateUserPasswordDto {
  password?: string;
}
