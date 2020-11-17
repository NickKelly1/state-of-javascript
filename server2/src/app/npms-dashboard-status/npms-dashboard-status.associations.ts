import { Association } from "sequelize";
import { UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NewsArticleModel } from "../news-article/news-article.model";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";
import { NpmsDashboardStatusModel } from "./npms-dashboard-status.model";

export interface NpmsDashboardStatusAssociations {
  [index: string]: Association;
  dashboards: Association<NpmsDashboardStatusModel, NewsArticleModel>;
};

export const NpmsDashboardStatusAssociation: K2K<NpmsDashboardStatusAssociations> = {
  dashboards: 'dashboards',
}