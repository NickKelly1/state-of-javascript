import { Model, DataTypes, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { NewsArticleAssociation, NewsArticleAssociations } from './news-article.associations';
import { INewsArticleAttributes, INewsArticleCreationAttributes, NewsArticleField } from '../news-article/news-article.attributes';
import { NewsArticleId } from './news-article.id.type';
import { PermissionModel } from '../../circle';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { PermissionId } from '../permission/permission-id.type';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../user/user.model';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { NewsArticleDefinition } from './news-article.definition';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { NewsArticleStatusId } from '../news-article-status/news-article-status.id.type';
import { NewsArticleStatusModel } from '../news-article-status/news-article-status.model';
import { NewsArticleStatusField } from '../news-article-status/news-article-status.attributes';
import { UserField } from '../user/user.attributes';


export class NewsArticleModel extends Model<INewsArticleAttributes, INewsArticleCreationAttributes> implements INewsArticleAttributes {
  // fields
  [NewsArticleField.id]!: NewsArticleId;
  [NewsArticleField.author_id]!: UserId;
  [NewsArticleField.status_id]!: NewsArticleStatusId;
  [NewsArticleField.title]!: string;
  [NewsArticleField.teaser]!: string;
  [NewsArticleField.body]!: string;
  [NewsArticleField.scheduled_for]!: Date;

  [NewsArticleField.created_at]!: Date;
  [NewsArticleField.updated_at]!: Date;
  [NewsArticleField.deleted_at]!: Date;


  // acceptable associations
  static associations: NewsArticleAssociations;

  // eager loaded associations
  [NewsArticleAssociation.author]?: UserModel;
  [NewsArticleAssociation.status]?: NewsArticleStatusId;

  // associations
  getAuthor!: BelongsToGetAssociationMixin<UserModel>;
}


export const initNewsArticleModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NewsArticleModel.init({
    id: AutoIncrementingId,
    author_id: {
      type: DataTypes.INTEGER,
      references: { model: UserModel as typeof Model, key: UserField.id },
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      references: { model: NewsArticleStatusModel as typeof Model, key: NewsArticleStatusField.id },
      allowNull: false,
    },
    title: { type: DataTypes.STRING(NewsArticleDefinition.title.max), allowNull: false, },
    teaser: { type: DataTypes.STRING(NewsArticleDefinition.teaser.max), allowNull: false, },
    body: { type: DataTypes.STRING(NewsArticleDefinition.body.max), allowNull: false, },
    scheduled_for: { type: DataTypes.DATE, allowNull: true, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'news_articles',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
