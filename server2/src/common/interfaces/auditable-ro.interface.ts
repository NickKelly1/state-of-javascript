import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";
import { DateStr } from "../types/date-str.type";

export interface IAuditableRo {
  [created_at]: DateStr;
  [updated_at]: DateStr;
}