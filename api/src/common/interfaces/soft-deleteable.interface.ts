import { deleted_at } from "../schemas/constants/deleted_at.const";
import { OrNull } from "../types/or-null.type";

export interface ISoftDeleteable {
  [deleted_at]: OrNull<Date>;
}