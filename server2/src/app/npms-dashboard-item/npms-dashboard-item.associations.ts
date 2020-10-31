import { Association } from "sequelize";
import { K2K } from "../../common/types/k2k.type";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { NpmsPackageModel } from "../npms-package/npms-package.model";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export interface NpmsDashboardItemAssociations {
  [index: string]: Association;
  dashboard: Association<NpmsDashboardItemModel, NpmsDashboardModel>;
  npmsPackage: Association<NpmsDashboardItemModel, NpmsPackageModel>;
};

export const NpmsDashboardItemAssociation: K2K<NpmsDashboardItemAssociations> = {
  dashboard: 'dashboard',
  npmsPackage: 'npmsPackage',
}