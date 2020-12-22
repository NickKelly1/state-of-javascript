import { Model, DataTypes, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { BlogPostStatusAssociation, BlogPostStatusAssociations } from './blog-post-status.associations';
import { BlogPostStatusId } from './blog-post-status.id.type';
import { BlogPostStatusDefinition } from './blog-post-status.definition';
import { IBlogPostStatusAttributes, IBlogPostStatusCreationAttributes, BlogPostStatusField } from './blog-post-status.attributes';
import { BlogPostModel } from '../blog-post/blog-post.model';


export class BlogPostStatusModel extends Model<IBlogPostStatusAttributes, IBlogPostStatusCreationAttributes> implements IBlogPostStatusAttributes {
  // fields
  [BlogPostStatusField.id]!: BlogPostStatusId;
  [BlogPostStatusField.name]!: string;
  [BlogPostStatusField.colour]!: string;

  [BlogPostStatusField.created_at]!: Date;
  [BlogPostStatusField.updated_at]!: Date;


  // acceptable associations
  static associations: BlogPostStatusAssociations;

  // eager loaded associations
  [BlogPostStatusAssociation.posts]?: BlogPostModel[];
}


export const initBlogPostStatusModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  BlogPostStatusModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, },
    name: { type: DataTypes.STRING(BlogPostStatusDefinition.name.max), allowNull: false, },
    colour: { type: DataTypes.STRING(BlogPostStatusDefinition.colour.max), allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'blog_post_statuses',
    ...AuditableSchema,
  });
}
