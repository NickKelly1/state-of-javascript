import { deleted_at } from "../schemas/constants/deleted_at.const";
import { DateStr } from "../types/date-str.type";
import { OrNull } from "../types/or-null.type";

export interface ISoftDeleteableRo {
  [deleted_at]: OrNull<DateStr>;
}