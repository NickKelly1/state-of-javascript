import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { NewsArticleId } from "../news-article/news-article.id.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { UserId } from "../user/user.id.type";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { NewsArticleStatusId } from "../news-article-status/news-article-status.id.type";
import { OrNull } from "../../common/types/or-null.type";

export interface INewsArticleAttributes extends IAuditable, ISoftDeleteable {
  id: NewsArticleId;
  status_id: NewsArticleStatusId;
  author_id: UserId;
  title: string;
  teaser: string;
  body: string;
  scheduled_for: OrNull<Date>;
}

export const NewsArticleField: K2K<INewsArticleAttributes> = {
  id: 'id',
  status_id: 'status_id',
  author_id: 'author_id',
  title: 'title',
  teaser: 'teaser',
  body: 'body',
  scheduled_for: 'scheduled_for',
  [created_at]: created_at,
  [updated_at]: updated_at,
  [deleted_at]: deleted_at,
}

export interface INewsArticleCreationAttributes extends Optional<INewsArticleAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

