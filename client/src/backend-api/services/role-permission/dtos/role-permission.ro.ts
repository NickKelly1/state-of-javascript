import { IAuditableRo } from "../../../types/auditable-ro.interface";
import { PermissionId } from "../../permission/permission.id";
import { RoleId } from "../../role/role.id";
import { RolePermissionId } from "../role-permission.id";

export interface IRolePermissionRo extends IAuditableRo {
  id: RolePermissionId;
  role_id: RoleId;
  permission_id: PermissionId;
}