import Joi from 'joi';
import { UserModel } from '../../../circle';
import { OrNull } from '../../../common/types/or-null.type';
import { UserDefinition } from '../user.definition';

export interface IUserServiceUpdateUserDto {
  name?: string;
  email?: OrNull<string>;
  verified?: boolean;
  deactivated?: boolean;
}

// export const UserServiceUpdateUserDtoValidator = Joi.object<IUserServiceUpdateUserDto>({
//   name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).optional(),
//   email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).optional(),
//   verified: Joi.bool().optional(),
//   deactivated: Joi.bool().optional(),
// });
