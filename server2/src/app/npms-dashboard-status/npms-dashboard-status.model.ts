import { Model, DataTypes, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { NpmsDashboardStatusAssociation, NpmsDashboardStatusAssociations } from './npms-dashboard-status.associations';
import { NpmsDashboardStatusId } from './npms-dashboard-status.id.type';
import { NpmsDashboardStatusDefinition } from './npms-dashboard-status.definition';
import { INpmsDashboardStatusAttributes, INpmsDashboardStatusCreationAttributes, NpmsDashboardStatusField } from './npms-dashboard-status.attributes';
import { NpmsDashboardModel } from '../npms-dashboard/npms-dashboard.model';


export class NpmsDashboardStatusModel extends Model<INpmsDashboardStatusAttributes, INpmsDashboardStatusCreationAttributes> implements INpmsDashboardStatusAttributes {
  // fields
  [NpmsDashboardStatusField.id]!: NpmsDashboardStatusId;
  [NpmsDashboardStatusField.name]!: string;

  [NpmsDashboardStatusField.created_at]!: Date;
  [NpmsDashboardStatusField.updated_at]!: Date;


  // acceptable associations
  static associations: NpmsDashboardStatusAssociations;

  // eager loaded associations
  [NpmsDashboardStatusAssociation.dashboards]?: NpmsDashboardModel[];
}


export const initNpmsDashboardStatusModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NpmsDashboardStatusModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, },
    name: { type: DataTypes.STRING(NpmsDashboardStatusDefinition.name.max), allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'npms_dashboard_statuses',
    ...AuditableSchema,
  });
}
