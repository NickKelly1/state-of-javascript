import { Association } from "sequelize";
import { UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";
import { NewsArticleModel } from "./news-article.model";

export interface NewsArticleAssociations {
  [index: string]: Association;
  author: Association<NewsArticleModel, UserModel>;
};

export const NewsArticleAssociation: K2K<NewsArticleAssociations> = {
  author: 'author',
}