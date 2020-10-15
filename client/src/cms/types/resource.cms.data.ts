import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData } from "./auditable.cms.interface";
import { MediaCmsResource } from "./media.cms.resource";
import { ResourceSubcategoryCmsData } from "./resource-subcategory.cms.type";


export interface ResourceCmsData extends AuditableCmsData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<string>;
  link: OrNullable<string>;
}
