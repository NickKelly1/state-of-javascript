import { OrIntId } from '../../types/or-int-id.type';
import { OmitAudit } from '../../types/omit-audit.type';
import { AuditableCmsData } from './auditable.cms.interface';
import { OrNullable } from '../../types/or-nullable.type';

export interface TopicCmsData extends AuditableCmsData {
  id: number;
  name: OrNullable<string>;
  description: OrNullable<string>;
}