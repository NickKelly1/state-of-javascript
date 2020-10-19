import { IWithIat } from "../../../types/with-exp.interface";
import { PermissionId } from "../../permission/permission.id";
import { UserId } from "../../user/user.id";

export interface IPreAccessTokenDto {
  user_id: UserId;
  permissions: PermissionId[];
}

export interface IAccessTokenDto extends IPreAccessTokenDto, IWithIat {}