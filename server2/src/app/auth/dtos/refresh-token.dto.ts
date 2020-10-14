import Joi from "joi";
import { IWithIat } from "../../../common/interfaces/with-exp.interface";
import { PermissionId } from "../../permission/permission-id.type";
import { UserId } from "../../user/user.id.type";

export interface IPreRefreshTokenDto {
  user_id: UserId;
}

export interface IRefreshTokenDto extends IPreRefreshTokenDto, IWithIat {}

export const RefreshTokenDto = Joi.object<IRefreshTokenDto>({
  user_id: Joi.number().integer().positive().required(),
  iat: Joi.number().integer().positive().required(),
  exp: Joi.number().integer().positive().required(),
});