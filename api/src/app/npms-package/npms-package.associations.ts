import { Association } from "sequelize";
import { NpmsDashboardItemModel, NpmsDashboardModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NpmsPackageModel } from "./npms-package.model";

export interface NpmsPackageAssociations {
  [index: string]: Association;
  dashboard_items: Association<NpmsPackageModel, NpmsDashboardItemModel>;
  dashboards: Association<NpmsPackageModel, NpmsDashboardModel>;
}

export const NpmsPackageAssociation: K2K<NpmsPackageAssociations> = {
  dashboard_items: 'dashboard_items',
  dashboards: 'dashboards',
}