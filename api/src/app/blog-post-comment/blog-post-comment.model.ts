import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { BlogPostCommentAssociation, BlogPostCommentAssociations } from './blog-post-comment.associations';
import { BlogPostCommentId } from './blog-post-comment.id.type';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../user/user.model';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { BlogPostCommentDefinition } from './blog-post-comment.definition';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { UserField } from '../user/user.attributes';
import { RequestAuth } from '../../common/classes/request-auth';
import { BlogPostCommentField, IBlogPostCommentAttributes, IBlogPostCommentCreationAttributes } from './blog-post-comment.attributes';
import { BlogPostModel } from '../blog-post/blog-post.model';
import { BaseContext } from '../../common/context/base.context';
import { BlogPostId } from '../blog-post/blog-post.id.type';
import { BlogPostField } from '../blog-post/blog-post.attributes';


export class BlogPostCommentModel extends Model<IBlogPostCommentAttributes, IBlogPostCommentCreationAttributes> implements IBlogPostCommentAttributes {
  // fields
  [BlogPostCommentField.id]!: BlogPostCommentId;
  [BlogPostCommentField.author_id]!: UserId;
  [BlogPostCommentField.post_id]!: BlogPostId;
  [BlogPostCommentField.hidden]!: boolean;
  [BlogPostCommentField.visible]!: boolean;
  [BlogPostCommentField.body]!: string;

  [BlogPostCommentField.created_at]!: Date;
  [BlogPostCommentField.updated_at]!: Date;
  [BlogPostCommentField.deleted_at]!: Date;


  // acceptable associations
  static associations: BlogPostCommentAssociations;

  // relations
  [BlogPostCommentAssociation.author]?: UserModel;
  [BlogPostCommentAssociation.post]?: BlogPostModel;

  // associations
  //

  // helpers
  isVisible(): boolean { return this.visible === true; }
  isHidden(): boolean { return this.hidden === true; }

  authIsAuthor(auth: RequestAuth): boolean { return auth.isMeById(this.author_id); }
  ctxIsAuthor(ctx: BaseContext): boolean { return this.authIsAuthor(ctx.auth); }
}


export const initBlogPostCommentModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  BlogPostCommentModel.init({
    id: AutoIncrementingId,
    author_id: {
      type: DataTypes.INTEGER,
      references: { model: UserModel as typeof Model, key: UserField.id },
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: { model: BlogPostModel as typeof Model, key: BlogPostField.id },
      allowNull: false,
    },
    hidden: { type: DataTypes.BOOLEAN, allowNull: false, },
    visible: { type: DataTypes.BOOLEAN, allowNull: false, },
    body: { type: DataTypes.STRING(BlogPostCommentDefinition.body.max), allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'blog_post_comments',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
