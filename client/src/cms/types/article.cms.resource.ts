import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData, AuditableCmsMixin } from "./auditable.cms.interface";
import { MediaCmsResource } from "./media.cms.resource";
import { ResourceSubcategoryCmsData } from "./resource-subcategory.cms.type";
import { ArticleCmsData } from "./article.cms.data";
import { TagCmsResource } from "./tag.cms.data";
import { TopicCmsResource } from "./topic.cms.resource";

export interface ArticleCmsResource extends AuditableCmsMixin<ArticleCmsData> {
  topic: OrNullable<TopicCmsResource>;
  icon: OrNullable<MediaCmsResource>;
  tags: OrNullable<TagCmsResource[]>;
}