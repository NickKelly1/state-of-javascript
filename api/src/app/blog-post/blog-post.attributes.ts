import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { UserId } from "../user/user.id.type";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { BlogPostStatusId } from "../blog-post-status/blog-post-status.id.type";
import { BlogPostId } from "./blog-post.id.type";

export interface IBlogPostAttributes extends IAuditable, ISoftDeleteable {
  id: BlogPostId;
  status_id: BlogPostStatusId;
  author_id: UserId;
  title: string;
  teaser: string;
  body: string;
}

export const BlogPostField: K2K<IBlogPostAttributes> = {
  id: 'id',
  status_id: 'status_id',
  author_id: 'author_id',
  title: 'title',
  teaser: 'teaser',
  body: 'body',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlogPostCreationAttributes extends Optional<IBlogPostAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

