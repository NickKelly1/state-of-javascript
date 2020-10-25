import { Association } from "sequelize";
import { UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { NewsArticleStatusModel } from "../news-article-status/news-article-status.model";
import { NewsArticleModel } from "./news-article.model";

export interface NewsArticleAssociations {
  [index: string]: Association;
  author: Association<NewsArticleModel, UserModel>;
  status: Association<NewsArticleModel, NewsArticleStatusModel>;
};

export const NewsArticleAssociation: K2K<NewsArticleAssociations> = {
  author: 'author',
  status: 'status',
}