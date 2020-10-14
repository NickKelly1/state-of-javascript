import { IAuditableRo } from "../../../common/interfaces/auditable-ro.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionId } from "../../permission/permission-id.type";
import { RoleId } from "../../role/role.id.type";
import { UserId } from "../../user/user.id.type";
import { RolePermissionId } from "../role-permission.id.type";

export interface IRolePermissionRo extends IAuditableRo {
  id: RolePermissionId;
  role_id: RoleId;
  permission_id: PermissionId;
}