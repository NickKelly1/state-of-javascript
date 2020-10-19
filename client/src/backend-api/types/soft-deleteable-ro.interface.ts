import { DateString } from "../../types/date-string.type";
import { OrNull } from "../../types/or-null.type";
import { deleted_at } from "../constants/deleted_at.const";

export interface ISoftDeleteableRo {
  [deleted_at]: OrNull<DateString>;
}