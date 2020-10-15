import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData } from "./auditable.cms.interface";

export interface MediaCmsData extends AuditableCmsData {
  id: number;
  name: OrNullable<string>;
  alternativeText: OrNullable<string>;
  caption: OrNullable<string>;
  width: OrNullable<number>;
  height: OrNullable<number>;
  formats: null;
  hash: OrNullable<string>;
  ext: OrNullable<string>;
  mime: OrNullable<string>;
  size: OrNullable<number>;
  url: OrNullable<string>;
  previewUrl: null;
  provider: OrNullable<string>;
  provider_metadat: OrNullable<string>;
}