import { IAuditableRo } from "../../../types/auditable-ro.interface";
import { RoleId } from "../role.id";

export interface IRoleRo extends IAuditableRo {
  id: RoleId;
  name: string;
}