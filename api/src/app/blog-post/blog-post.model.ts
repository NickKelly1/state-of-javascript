import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { BlogPostAssociation, BlogPostAssociations } from './blog-post.associations';
import { BlogPostId } from './blog-post.id.type';
import { UserId } from '../user/user.id.type';
import { UserModel } from '../user/user.model';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { BlogPostDefinition } from './blog-post.definition';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { UserField } from '../user/user.attributes';
import { RequestAuth } from '../../common/classes/request-auth';
import { BlogPostField, IBlogPostAttributes, IBlogPostCreationAttributes } from './blog-post.attributes';
import { BlogPostStatusId } from '../blog-post-status/blog-post-status.id.type';
import { BlogPostStatus } from '../blog-post-status/blog-post-status.const';
import { BlogPostStatusModel } from '../../circle';
import { BlogPostStatusField } from '../blog-post-status/blog-post-status.attributes';
import { BaseContext } from '../../common/context/base.context';
import { BlogPostCommentModel } from '../blog-post-comment/blog-post-comment.model';
import { ImageId } from '../image/image.id.type';
import { OrNull } from '../../common/types/or-null.type';
import { ImageModel } from '../image/image.model';
import { ImageField } from '../image/image.attributes';


export class BlogPostModel extends Model<IBlogPostAttributes, IBlogPostCreationAttributes> implements IBlogPostAttributes {
  // fields
  [BlogPostField.id]!: BlogPostId;
  [BlogPostField.image_id]!: OrNull<ImageId>;
  [BlogPostField.author_id]!: UserId;
  [BlogPostField.status_id]!: BlogPostStatusId;
  [BlogPostField.title]!: string;
  [BlogPostField.teaser]!: string;
  [BlogPostField.body]!: string;

  [BlogPostField.created_at]!: Date;
  [BlogPostField.updated_at]!: Date;
  [BlogPostField.deleted_at]!: Date;


  // acceptable associations
  static associations: BlogPostAssociations;

  // eager loaded associations
  [BlogPostAssociation.author]?: UserModel;
  [BlogPostAssociation.status]?: BlogPostStatusModel;
  [BlogPostAssociation.image]?: OrNull<ImageModel>;
  [BlogPostAssociation.comments]?: BlogPostCommentModel[];

  // associations
  //

  // helpers
  isDraft(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Draft; }
  isRejected(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Rejected; }
  isSubmitted(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Submitted; }
  isApproved(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Approved; }
  isPublished(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Published; }
  isUnpublished(): boolean { return this[BlogPostField.status_id] === BlogPostStatus.Unpublished; }

  /** Is the BlogPost Submittable? */
  isSubmittable(): boolean {
    return this.isDraft()
      || this.isRejected()
      || this.isUnpublished();
  }

  /** Is the BlogPost Rejectable? */
  isRejectable(): boolean {
    return this.isSubmitted()
      || this.isApproved()
      || this.isPublished()
      || this.isUnpublished();
  }

  /** Is the BlogPost Approvable? */
  isApprovable(): boolean {
    return this.isDraft()
      || this.isRejected()
      || this.isSubmitted()
      || this.isUnpublished();
  }

  /** Is the BlogPost Publishable? */
  isPublishable(): boolean {
    return this.isDraft()
      || this.isRejected()
      || this.isSubmitted()
      || this.isApproved()
      || this.isUnpublished();
  }

  /** Is the BlogPost Unpublishable? */
  isUnpublishable(): boolean {
    return this.isPublished();
  }

  authIsAuthor(auth: RequestAuth): boolean { return auth.isMeById(this.author_id); }
  ctxIsAuthor(ctx: BaseContext): boolean { return this.authIsAuthor(ctx.auth); }
}


export const initBlogPostModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  BlogPostModel.init({
    id: AutoIncrementingId,
    image_id: {
      type: DataTypes.INTEGER,
      references: { model: ImageModel as typeof Model, key: ImageField.id },
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: { model: UserModel as typeof Model, key: UserField.id },
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      references: { model: BlogPostStatusModel as typeof Model, key: BlogPostStatusField.id },
      allowNull: false,
    },
    title: { type: DataTypes.STRING(BlogPostDefinition.title.max), allowNull: false, },
    teaser: { type: DataTypes.STRING(BlogPostDefinition.teaser.max), allowNull: false, },
    body: { type: DataTypes.STRING(BlogPostDefinition.body.max), allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'blog_posts',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
