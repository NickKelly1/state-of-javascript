import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { BlogPostStatusId } from "./blog-post-status.id.type";

export interface IBlogPostStatusAttributes extends IAuditable {
  id: BlogPostStatusId;
  name: string;
  colour: string;
}

export const BlogPostStatusField: K2K<IBlogPostStatusAttributes> = {
  id: 'id',
  name: 'name',
  colour: 'colour',
  [created_at]: created_at,
  [updated_at]: updated_at,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlogPostStatusCreationAttributes extends Optional<IBlogPostStatusAttributes,
  | id
  | created_at
  | updated_at
> {}

