import { OrIntId } from "../../types/or-int-id.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData, AuditableCmsMixin } from "./auditable.cms.interface";
import { MediaCmsResource } from "./media.cms.resource";
import { TopicCmsResource } from "./topic.cms.resource";

export interface TagCmsData extends AuditableCmsData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<number>;
}

export interface TagCmsResource extends AuditableCmsMixin<TagCmsData>  {
  icon: MediaCmsResource;
}