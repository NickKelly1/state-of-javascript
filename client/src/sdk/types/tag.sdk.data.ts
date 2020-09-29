import { OrIntId } from "../../types/or-int-id.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableSdkData, AuditableSdkMixin } from "./auditable.sdk.interface";
import { MediaSdkResource } from "./media.sdk.resource";
import { TopicSdkResource } from "./topic.sdk.resource";

export interface TagSdkData extends AuditableSdkData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<number>;
}

export interface TagSdkResource extends AuditableSdkMixin<TagSdkData>  {
  icon: MediaSdkResource;
}