import { OrNullable } from "../../types/or-nullable.type";
import { AuditableSdkData, } from "./auditable.sdk.interface";

export interface StorySdkData extends AuditableSdkData {
  id: number;
  title: OrNullable<string>;
  description: OrNullable<string>;
  source: OrNullable<string>;
}
