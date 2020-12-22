import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { UserId } from "../user/user.id.type";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { BlogPostCommentId } from "./blog-post-comment.id.type";
import { BlogPostId } from '../blog-post/blog-post.id.type';


// todo: fix....
export interface IBlogPostCommentAttributes extends IAuditable, ISoftDeleteable {
  id: BlogPostCommentId;
  hidden: boolean;
  visible: boolean;
  author_id: UserId;
  post_id: BlogPostId;
  body: string;
}

export const BlogPostCommentField: K2K<IBlogPostCommentAttributes> = {
  id: 'id',
  hidden: 'hidden',
  visible: 'visible',
  author_id: 'author_id',
  post_id: 'post_id',
  body: 'body',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlogPostCommentCreationAttributes extends Optional<IBlogPostCommentAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

