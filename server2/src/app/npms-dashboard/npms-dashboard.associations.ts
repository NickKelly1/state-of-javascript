import { Association } from "sequelize";
import { NpmsDashboardItemModel, UserModel, NpmsDashboardStatusModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NpmsPackageModel } from "../npms-package/npms-package.model";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export interface NpmsDashboardAssociations {
  [index: string]: Association;
  owner: Association<NpmsDashboardModel, UserModel>;
  items: Association<NpmsDashboardModel, NpmsDashboardItemModel>;
  npmsPackages: Association<NpmsDashboardModel, NpmsPackageModel>;
  status: Association<NpmsDashboardModel, NpmsDashboardStatusModel>;
};

export const NpmsDashboardAssociation: K2K<NpmsDashboardAssociations> = {
  owner: 'owner',
  items: 'items',
  npmsPackages: 'npmsPackages',
  status: 'status',
}