import { IAuditableRo } from "../../../types/auditable-ro.interface";
import { RoleId } from "../../role/role.id";
import { UserId } from "../../user/user.id";
import { UserRoleId } from "../user-role.id";

export interface IUserRoleRo extends IAuditableRo {
  id: UserRoleId;
  user_id: UserId;
  role_id: RoleId;
}