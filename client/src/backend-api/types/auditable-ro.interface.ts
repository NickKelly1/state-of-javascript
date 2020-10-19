import { DateString } from "../../types/date-string.type";
import { created_at } from "../constants/created_at.const";
import { updated_at } from "../constants/updated_at.const";

export interface IAuditableRo {
  [created_at]: DateString;
  [updated_at]: DateString;
}