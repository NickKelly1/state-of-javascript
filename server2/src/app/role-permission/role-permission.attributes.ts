import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { PermissionId } from "../permission/permission-id.type";
import { RolePermissionId } from "../role-permission/role-permission.id.type";
import { RoleId } from "../role/role.id.type";
import { UserId } from "../user/user.id.type";

export interface IRolePermissionAttributes extends IAuditable {
  id: RolePermissionId;
  role_id: RoleId;
  permission_id: PermissionId;
}

export const RolePermissionField: K2K<IRolePermissionAttributes> = {
  id: 'id',
  role_id: 'role_id',
  permission_id: 'permission_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export interface IRolePermissionCreationAttributes extends Optional<IRolePermissionAttributes,
  | id
  | created_at
  | updated_at
> {}

