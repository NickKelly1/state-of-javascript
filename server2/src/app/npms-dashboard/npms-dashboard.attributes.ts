import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { UserId } from "../user/user.id.type";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { OrNull } from "../../common/types/or-null.type";
import { NpmsDashboardId } from "./npms-dashboard.id.type";

export interface INpmsDashboardAttributes extends IAuditable, ISoftDeleteable {
  id: NpmsDashboardId;
  name: string;
}

export const NpmsDashboardField: K2K<INpmsDashboardAttributes> = {
  id: 'id',
  name: 'name',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

export interface INpmsDashboardCreationAttributes extends Optional<INpmsDashboardAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

