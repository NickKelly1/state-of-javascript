import { DateString } from "../../types/date-string.type";
import { OmitAudit } from "../../types/omit-audit.type";
import { OrIntId } from "../../types/or-int-id.type";
import { OrNull } from "../../types/or-null.type";
import { OrNullable } from "../../types/or-nullable.type";
import { UserSdkResource } from "./user.sdk.resource";

export interface AuditableSdkData {
  created_by: number;
  updated_by: number;
  created_at: DateString;
  updated_at: DateString;
}

export interface AuditableSdkResource {
  created_by: OrNull<OrIntId<UserSdkResource>>;
  updated_by: OrNull<OrIntId<UserSdkResource>>;
}

export type AuditableSdkMixin<T> = OmitAudit<T> & AuditableSdkResource;
