import { AuditableCmsMixin } from './auditable.cms.interface';
import { OrNullable } from "../../types/or-nullable.type";
import { MediaCmsResource } from './media.cms.resource';
import { TopicCmsData } from './topic.cms.data';

export interface TopicCmsResource extends AuditableCmsMixin<TopicCmsData> {
  icon: OrNullable<MediaCmsResource>
}