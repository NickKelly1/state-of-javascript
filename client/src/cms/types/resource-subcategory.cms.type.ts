import { OrNullable } from "../../types/or-nullable.type";
import { AuditableCmsData } from "./auditable.cms.interface";

export interface ResourceSubcategoryCmsData extends AuditableCmsData {
  id: number;
  name: OrNullable<string>;
  resource_category: OrNullable<number>;
}