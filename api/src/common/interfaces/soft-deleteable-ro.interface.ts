import { deleted_at } from "../schemas/constants/deleted_at.const";
import { DateString } from "../types/date-string.type";
import { OrNull } from "../types/or-null.type";

export interface ISoftDeleteableRo {
  [deleted_at]: OrNull<DateString>;
}