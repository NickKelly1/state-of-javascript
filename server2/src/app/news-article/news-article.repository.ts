import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserPasswordModel } from "../user-password/user-password.model";
import { NewsArticleModel } from "./news-article.model";



export class NewsArticleRepository extends BaseRepository<NewsArticleModel> {
  protected readonly Model = NewsArticleModel as ModelCtor<NewsArticleModel>;
}