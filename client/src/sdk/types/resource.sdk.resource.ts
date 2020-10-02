import { OrNullable } from "../../types/or-nullable.type";
import { MediaSdkResource } from "./media.sdk.resource";
import { ResourceSubcategorySdkData } from "./resource-subcategory.sdk.type";
import { ResourceSdkData } from "./resource.sdk.data";

export interface ResourceSdkResource extends ResourceSdkData {
  resource_subcategory: OrNullable<ResourceSubcategorySdkData>;
  icon: OrNullable<MediaSdkResource>;
  logo: OrNullable<MediaSdkResource>;
  example: OrNullable<MediaSdkResource>;
}