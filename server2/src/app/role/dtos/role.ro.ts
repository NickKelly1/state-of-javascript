import { IAuditableRo } from "../../../common/interfaces/auditable-ro.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { RoleId } from "../role.id.type";

export interface IRoleRo extends IAuditableRo {
  id: RoleId;
  name: string;
}