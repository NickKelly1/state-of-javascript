import { OrNullable } from '../../../common/types/or-nullable.type';
import { NpmsDashboardStatusId } from '../../npms-dashboard-status/npms-dashboard-status.id.type';

export interface INpmsDashboardServiceCreateNpmsDashboardDto {
  name: string;
  aid?: OrNullable<string>;
  status_id: NpmsDashboardStatusId,
}
