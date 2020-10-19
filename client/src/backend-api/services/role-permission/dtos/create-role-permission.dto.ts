import { PermissionId } from "../../permission/permission.id";
import { RoleId } from "../../role/role.id";

export interface ICreateRolePermissionDto {
  role_id: RoleId;
  permission_id: PermissionId;
}
