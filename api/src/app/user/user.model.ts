import { Model, DataTypes, HasOneGetAssociationMixin, HasManyGetAssociationsMixin, } from 'sequelize';
import { UserPasswordModel } from '../../circle';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { OrNull } from '../../common/types/or-null.type';
import { UserAssociation, UserAssociations } from './user.associations';
import { IUserAttributes, IUserCreationAttributes, UserField } from '../user/user.attributes';
import { UserDefinition } from './user.definition';
import { UserId } from './user.id.type';
import { RoleModel } from '../role/role.model';
import { UserRoleModel } from '../user-role/user-role.model';
import { NewsArticleModel } from '../news-article/news-article.model';
import { User } from './user.const';
import { NpmsDashboardModel } from '../npms-dashboard/npms-dashboard.model';
import { UserTokenModel } from '../user-token/user-token.model';
import { RequestAuth } from '../../common/classes/request-auth';
import { BlogPostModel } from '../blog-post/blog-post.model';
import { BlogPostCommentModel } from '../blog-post-comment/blog-post-comment.model';


export class UserModel extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  // fields
  [UserField.id]!: UserId;
  [UserField.name]!: string;
  [UserField.email]!: OrNull<string>;
  [UserField.verified]!: boolean;
  [UserField.deactivated]!: boolean;
  [UserField.created_at]!: Date;
  [UserField.updated_at]!: Date;
  [UserField.deleted_at]!: OrNull<Date>;


  // acceptable associations
  static associations: UserAssociations;

  // eager loaded associations
  [UserAssociation.userLinks]?: UserTokenModel[];
  [UserAssociation.password]?: UserPasswordModel;
  [UserAssociation.roles]?: RoleModel[];
  [UserAssociation.userRoles]?: UserRoleModel[];
  [UserAssociation.npmsDashboards]?: NpmsDashboardModel[];
  [UserAssociation.blogPosts]?: BlogPostModel[];
  [UserAssociation.blogPostComments]?: BlogPostCommentModel[];

  // associations
  //

  // helpers
  isVerified(): boolean { return this[UserField.id] === User.Admin; }
  isDeactivated(): boolean { return this[UserField.deactivated] === true; }
  isAdmin(): boolean { return this[UserField.id] === User.Admin; }
  isAnonymous(): boolean { return this[UserField.id] === User.Anonymous; }
  isSystem(): boolean { return this[UserField.id] === User.System; }
}


export const initUserModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  UserModel.init({
    id: AutoIncrementingId,
    name: { type: DataTypes.STRING(UserDefinition.name.max), allowNull: false, unique: 'email_name', },
    email: { type: DataTypes.STRING(UserDefinition.email.max), allowNull: true, unique: 'email_name', },
    verified: { type: DataTypes.BOOLEAN, allowNull: false, },
    deactivated: { type: DataTypes.BOOLEAN, allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'users',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
