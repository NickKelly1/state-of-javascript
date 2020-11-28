import Joi from 'joi';
import { UserModel } from '../../../circle';
import { OrNull } from '../../../common/types/or-null.type';
import { UserDefinition } from '../user.definition';

export interface IUserServiceCreateUserDto {
  name: string
  email: OrNull<string>;
  verified: boolean;
  deactivated: boolean;
}

// export const UserServiceCreateUserDtoValidator = Joi.object<IUserServiceCreateUserDto>({
//   name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
//   email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).required(),
//   verified: Joi.bool().required(),
//   locked: Joi.bool().required(),
// });
