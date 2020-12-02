import { IAuditableRo } from "../../../common/interfaces/auditable-ro.interface";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionId } from "../permission-id.type";

export interface IPermissionRo extends IAuditableRo {
  id: PermissionId;
  name: string;
}