import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { OrNull } from "../../common/types/or-null.type";
import { UserId } from "../user/user.id.type";
import { NpmsPackageInfo } from "./api/npms-api.package-info.type";

export interface INpmsPackageAttributes extends IAuditable, ISoftDeleteable {
  id: UserId;
  name: string;
  data: OrNull<NpmsPackageInfo>;
  last_ran_at: Date;
}

export const NpmsPackageField: K2K<INpmsPackageAttributes> = {
  id: 'id',
  name: 'name',
  data: 'data',
  last_ran_at: 'last_ran_at',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  updated_at: 'updated_at',
}

export interface INpmsPackageCreationAttributes extends Optional<INpmsPackageAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

