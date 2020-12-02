import Joi from 'joi';
import { UserModel } from '../../../circle';
import { IJson } from '../../../common/interfaces/json.interface';
import { OrNull } from '../../../common/types/or-null.type';
import { UserTokenType } from '../../user-token-type/user-token-type.const';
import { UserTokenTypeId } from '../../user-token-type/user-token-type.id.type';

export interface IUserTokenServiceCreateUserTokenDto {
  type_id: UserTokenTypeId;
  data: OrNull<IJson>;
  expires_at: OrNull<Date>;
  redirect_uri: OrNull<string>;
}
