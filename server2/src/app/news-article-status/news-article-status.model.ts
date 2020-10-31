import { Model, DataTypes, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { NewsArticleStatusAssociation, NewsArticleStatusAssociations } from './news-article-status.associations';
import { NewsArticleStatusId } from './news-article-status.id.type';
import { PermissionModel } from '../../circle';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { PermissionId } from '../permission/permission-id.type';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../user/user.model';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { NewsArticleStatusDefinition } from './news-article-status.definition';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { INewsArticleStatusAttributes, INewsArticleStatusCreationAttributes, NewsArticleStatusField } from './news-article-status.attributes';
import { NewsArticleModel } from '../news-article/news-article.model';


export class NewsArticleStatusModel extends Model<INewsArticleStatusAttributes, INewsArticleStatusCreationAttributes> implements INewsArticleStatusAttributes {
  // fields
  [NewsArticleStatusField.id]!: NewsArticleStatusId;
  [NewsArticleStatusField.name]!: string;

  [NewsArticleStatusField.created_at]!: Date;
  [NewsArticleStatusField.updated_at]!: Date;


  // acceptable associations
  static associations: NewsArticleStatusAssociations;

  // eager loaded associations
  [NewsArticleStatusAssociation.articles]?: NewsArticleModel[];

  // associations
  getUser!: BelongsToGetAssociationMixin<UserModel>;
}


export const initNewsArticleStatusModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NewsArticleStatusModel.init({
    id: AutoIncrementingId,
    name: { type: DataTypes.STRING(NewsArticleStatusDefinition.name.max), allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'news_article_statuses',
    ...AuditableSchema,
  });
}
