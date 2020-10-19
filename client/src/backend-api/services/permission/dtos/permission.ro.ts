import { IAuditableRo } from "../../../types/auditable-ro.interface";
import { PermissionId } from "../permission.id";

export interface IPermissionRo extends IAuditableRo {
  id: PermissionId;
  name: string;
}