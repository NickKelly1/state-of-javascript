import { Association } from "sequelize";
import { UserModel, UserPasswordModel, RoleModel, UserRoleModel, NewsArticleModel  } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { UserTokenModel } from "../user-token/user-token.model";

export interface UserAssociations {
  [index: string]: Association;
  newsArticles: Association<UserModel, NewsArticleModel>;
  password: Association<UserModel, UserPasswordModel>;
  roles: Association<UserModel, RoleModel>;
  userRoles: Association<UserModel, UserRoleModel>;
  npmsDashboards: Association<UserModel, NpmsDashboardModel>;
  userLinks: Association<UserModel, UserTokenModel>;
};

export const UserAssociation: K2K<UserAssociations> = {
  newsArticles: 'newsArticles',
  password: 'password',
  roles: 'roles',
  userRoles: 'userRoles',
  npmsDashboards: 'npmsDashboards',
  userLinks: 'userLinks',
}