import { Association } from "sequelize";
import { UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NewsArticleModel } from "../news-article/news-article.model";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";
import { NewsArticleStatusModel } from "./news-article-status.model";

export interface NewsArticleStatusAssociations {
  [index: string]: Association;
  articles: Association<NewsArticleStatusModel, NewsArticleModel>;
};

export const NewsArticleStatusAssociation: K2K<NewsArticleStatusAssociations> = {
  articles: 'articles',
}