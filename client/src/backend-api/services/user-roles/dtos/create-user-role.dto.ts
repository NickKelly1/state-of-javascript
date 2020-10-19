import { RoleId } from "../../role/role.id";
import { UserId } from "../../user/user.id";

export interface ICreateUserRoleDto {
  role_id: RoleId;
  user_id: UserId;
}
