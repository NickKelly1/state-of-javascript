import { DateString } from "../../types/date-string.type";
import { OmitAudit } from "../../types/omit-audit.type";
import { OrIntId } from "../../types/or-int-id.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { UserCmsResource } from "./user.cms.resource";

export interface AuditableCmsData {
  created_by: number;
  updated_by: number;
  created_at: DateString;
  updated_at: DateString;
}

export interface AuditableCmsResource {
  created_by: OrNull<OrIntId<UserCmsResource>>;
  updated_by: OrNull<OrIntId<UserCmsResource>>;
}

export type AuditableCmsMixin<T> = OmitAudit<T> & AuditableCmsResource;
