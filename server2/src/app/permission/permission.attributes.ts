import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { PermissionCategoryId } from "../permission-category/permission-category-id.type";
import { PermissionId } from "./permission-id.type";

export interface IPermissionAttributes extends IAuditable, ISoftDeleteable {
  id: PermissionId;
  category_id: PermissionCategoryId;
  name: string;
}

export const PermissionField: K2K<IPermissionAttributes> = {
  id: 'id',
  category_id: 'category_id',
  name: 'name',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  updated_at: 'updated_at',
}

export interface IPermissionCreationAttributes extends Optional<IPermissionAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

