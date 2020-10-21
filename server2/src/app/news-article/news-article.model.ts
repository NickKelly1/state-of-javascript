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


export class NewsArticleModel extends Model<INewsArticleAttributes, INewsArticleCreationAttributes> implements INewsArticleAttributes {
  // fields
  [NewsArticleField.id]!: NewsArticleId;
  [NewsArticleField.author_id]!: UserId;
  [NewsArticleField.title]!: string;
  [NewsArticleField.teaser]!: string;
  [NewsArticleField.body]!: string;

  [NewsArticleField.created_at]!: Date;
  [NewsArticleField.updated_at]!: Date;
  [NewsArticleField.deleted_at]!: Date;


  // acceptable associations
  static associations: NewsArticleAssociations;

  // eager loaded associations
  [NewsArticleAssociation.author]?: UserModel;

  // associations
  getUser!: BelongsToGetAssociationMixin<UserModel>;
}


export const initNewsArticleModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;
  NewsArticleModel.init({
    id: AutoIncrementingId,
    author_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, },
    title: { type: DataTypes.STRING(NewsArticleDefinition.title.max), allowNull: false, },
    teaser: { type: DataTypes.STRING(NewsArticleDefinition.teaser.max), allowNull: false, },
    body: { type: DataTypes.STRING(NewsArticleDefinition.body.max), allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'news_articles',
    ...AuditableSchema,
  });
}
