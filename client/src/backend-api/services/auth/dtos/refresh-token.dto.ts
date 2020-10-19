import { IWithIat } from "../../../types/with-exp.interface";
import { UserId } from "../../user/user.id";

export interface IPreRefreshTokenDto {
  user_id: UserId;
}

export interface IRefreshTokenDto extends IPreRefreshTokenDto, IWithIat {}