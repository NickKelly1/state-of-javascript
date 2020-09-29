import { OrIntId } from '../../types/or-int-id.type';
import { OmitAudit } from '../../types/omit-audit.type';
import { AuditableSdkData } from './auditable.sdk.interface';
import { OrNullable } from '../../types/or-nullable.type';

export interface TopicSdkData extends AuditableSdkData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<string>;
}