import Joi from "joi";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { PermissionId } from "../../permission/permission-id.type";
import { UserId } from "../../user/user.id.type";

export interface IPreAccessTokenDto {
  user_id: UserId;
  permissions: PermissionId[];
}

export interface IAccessTokenDto extends IPreAccessTokenDto, IWithIat {}

export const AccessTokenDto = Joi.object<IAccessTokenDto>({
  user_id: Joi.number().integer().positive().required(),
  permissions: Joi.array().items(Joi.number().integer().positive()).required(),
  iat: Joi.number().integer().positive().required(),
  exp: Joi.number().integer().positive().required(),
});