import { IWithIat } from "../../../types/with-exp.interface";
import { PermissionId } from "../../permission/permission.id";

export interface IPreAccessTokenDto {
  user_id: number;
  permissions: PermissionId[];
}

export interface IAccessTokenDto extends IPreAccessTokenDto, IWithIat {}