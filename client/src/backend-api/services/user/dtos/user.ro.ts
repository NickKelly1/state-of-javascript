import { IAuditableRo } from "../../../types/auditable-ro.interface";
import { UserId } from "../user.id";

export interface IUserRo extends IAuditableRo {
  id: UserId;
  name: string;
}