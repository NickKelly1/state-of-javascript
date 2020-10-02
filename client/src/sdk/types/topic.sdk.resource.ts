import { AuditableSdkMixin } from './auditable.sdk.interface';
import { OrNullable } from "../../types/or-nullable.type";
import { MediaSdkResource } from './media.sdk.resource';
import { TopicSdkData } from './topic.sdk.data';

export interface TopicSdkResource extends AuditableSdkMixin<TopicSdkData> {
  icon: OrNullable<MediaSdkResource>
}