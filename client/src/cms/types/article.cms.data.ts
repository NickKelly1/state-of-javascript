import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData, } from "./auditable.cms.interface";

export interface ArticleCmsData extends AuditableCmsData {
  id: number;
  title: OrNullable<string>;
  teaser: OrNullable<string>;
  description: OrNullable<string>;
  source: OrNullable<string>;
}
