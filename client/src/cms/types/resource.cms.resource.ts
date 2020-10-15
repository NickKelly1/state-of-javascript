import { OrNullable } from "../../types/or-nullable.type";
import { MediaCmsResource } from "./media.cms.resource";
import { ResourceSubcategoryCmsData } from "./resource-subcategory.cms.type";
import { ResourceCmsData } from "./resource.cms.data";

export interface ResourceCmsResource extends ResourceCmsData {
  resource_subcategory: OrNullable<ResourceSubcategoryCmsData>;
  icon: OrNullable<MediaCmsResource>;
  logo: OrNullable<MediaCmsResource>;
  example: OrNullable<MediaCmsResource>;
}