import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { NpmsDashboardItemId } from "./npms-dashboard-item.id.type";
import { NpmsDashboardId } from "../npms-dashboard/npms-dashboard.id.type";
import { NpmsPackageId } from "../npms-package/npms-package.id.type";

export interface INpmsDashboardItemAttributes extends IAuditable {
  id: NpmsDashboardItemId;
  dashboard_id: NpmsDashboardId;
  npms_package_id: NpmsPackageId;
  order: number,
}

export const NpmsDashboardItemField: K2K<INpmsDashboardItemAttributes> = {
  id: 'id',
  dashboard_id: 'dashboard_id',
  npms_package_id: 'npms_package_id',
  order: 'order',
  [created_at]: created_at,
  [updated_at]: updated_at,
}

export interface INpmsDashboardItemCreationAttributes extends Optional<INpmsDashboardItemAttributes,
  | id
  | created_at
  | updated_at
> {}

