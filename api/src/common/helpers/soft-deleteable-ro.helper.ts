import { IAuditableRo } from "../interfaces/auditable-ro.interface";
import { IAuditable } from "../interfaces/auditable.interface";
import { ISoftDeleteableRo } from "../interfaces/soft-deleteable-ro.interface";
import { ISoftDeleteable } from "../interfaces/soft-deleteable.interface";

export function softDeleteableRo(model: ISoftDeleteable): ISoftDeleteableRo {
  return {
    deleted_at: model.deleted_at?.toISOString() ?? null,
  }
}