import { Association } from "sequelize";
import { NpmsDashboardItemModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NpmsPackageModel } from "../npms-package/npms-package.model";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export interface NpmsDashboardAssociations {
  [index: string]: Association;
  items: Association<NpmsDashboardModel, NpmsDashboardItemModel>;
  npmsPackages: Association<NpmsDashboardModel, NpmsPackageModel>;
};

export const NpmsDashboardAssociation: K2K<NpmsDashboardAssociations> = {
  items: 'items',
  npmsPackages: 'npmsPackages',
}