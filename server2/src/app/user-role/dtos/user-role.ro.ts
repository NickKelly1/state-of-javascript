import { IAuditableRo } from "../../../common/interfaces/auditable-ro.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { RoleId } from "../../role/role.id.type";
import { UserId } from "../../user/user.id.type";
import { UserRoleId } from "../user-role.id.type";

export interface IUserRoleRo extends IAuditableRo {
  id: UserRoleId;
  user_id: UserId;
  role_id: RoleId;
}