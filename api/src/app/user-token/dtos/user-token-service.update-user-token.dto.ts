import Joi from 'joi';
import { UserModel } from '../../../circle';
import { IJson } from '../../../common/interfaces/json.interface';
import { OrNull } from '../../../common/types/or-null.type';

export interface IUserTokenServiceUpdateUserTokenDto {
  data?: OrNull<IJson>;
  expires_at?: OrNull<Date>;
  redirect_uri?: OrNull<string>;
}
