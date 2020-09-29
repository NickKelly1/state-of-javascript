import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableSdkData, AuditableSdkMixin } from "./auditable.sdk.interface";
import { MediaSdkResource } from "./media.sdk.resource";
import { ResourceSubcategorySdkData } from "./resource-subcategory.sdk.type";
import { StorySdkData } from "./story.sdk.data";
import { TagSdkResource } from "./tag.sdk.data";
import { TopicSdkResource } from "./topic.sdk.resource";

export interface StorySdkResource extends AuditableSdkMixin<StorySdkData> {
  topic: OrNullable<TopicSdkResource>;
  icon: OrNullable<MediaSdkResource>;
  tags: OrNullable<TagSdkResource[]>;
}