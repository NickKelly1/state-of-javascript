import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";
import { DateString } from "../types/date-string.type";

export interface IAuditableRo {
  [created_at]: DateString;
  [updated_at]: DateString;
}