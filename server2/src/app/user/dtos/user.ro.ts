import { IAuditableRo } from "../../../common/interfaces/auditable-ro.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { UserId } from "../user.id.type";

export interface IUserRo extends IAuditableRo {
  id: UserId;
  name: string;
}