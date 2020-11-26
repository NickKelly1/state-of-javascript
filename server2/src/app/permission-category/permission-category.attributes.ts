import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { PermissionCategoryId } from "./permission-category-id.type";

export interface IPermissionCategoryAttributes extends IAuditable, ISoftDeleteable {
  id: PermissionCategoryId;
  name: string;
  colour?: string;
}

export const PermissionCategoryField: K2K<IPermissionCategoryAttributes> = {
  id: 'id',
  name: 'name',
  colour: 'colour',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  updated_at: 'updated_at',
}

export interface IPermissionCategoryCreationAttributes extends Optional<IPermissionCategoryAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

