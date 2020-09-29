import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableSdkData } from "./auditable.sdk.interface";
import { MediaSdkResource } from "./media.sdk.resource";
import { ResourceSubcategorySdkData } from "./resource-subcategory.sdk.type";


export interface ResourceSdkData extends AuditableSdkData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<string>;
  link: OrNullable<string>;
}
