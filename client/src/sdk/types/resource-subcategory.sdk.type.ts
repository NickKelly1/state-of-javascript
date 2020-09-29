import { OrNullable } from "../../types/or-nullable.type";
import { AuditableSdkData } from "./auditable.sdk.interface";

export interface ResourceSubcategorySdkData extends AuditableSdkData {
  id: number;
  name: OrNullable<string>;
  resource_category: OrNullable<number>;
}