import { IAuditableRo } from "../interfaces/auditable-ro.interface";
import { IAuditable } from "../interfaces/auditable.interface";

export function auditableRo(model: IAuditable): IAuditableRo {
  return {
    created_at: model.created_at.toISOString(),
    updated_at: model.created_at.toISOString(),
  }
}