import { IWithIat } from "../../../types/with-exp.interface";

export interface IPreRefreshTokenDto {
  user_id: number;
}

export interface IRefreshTokenDto extends IPreRefreshTokenDto, IWithIat {}