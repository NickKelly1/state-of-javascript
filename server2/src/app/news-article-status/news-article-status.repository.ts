import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserPasswordModel } from "../user-password/user-password.model";
import { NewsArticleStatusModel } from "./news-article-status.model";


export class NewsArticleStatusRepository extends BaseRepository<NewsArticleStatusModel> {
  protected readonly Model = NewsArticleStatusModel as ModelCtor<NewsArticleStatusModel>;
}