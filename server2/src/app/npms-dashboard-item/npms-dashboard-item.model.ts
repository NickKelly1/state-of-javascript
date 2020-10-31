import { Model, DataTypes, HasManyGetAssociationsMixin, BelongsToGetAssociationMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { NpmsDashboardItemAssociation, NpmsDashboardItemAssociations } from './npms-dashboard-item.associations';
import { NpmsDashboardItemId } from './npms-dashboard-item.id.type';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { INpmsDashboardItemAttributes, INpmsDashboardItemCreationAttributes, NpmsDashboardItemField } from './npms-dashboard-item.attributes';
import { NpmsDashboardModel } from '../npms-dashboard/npms-dashboard.model';
import { NpmsPackageId } from '../npms-package/npms-package.id.type';
import { NpmsDashboardId } from '../npms-dashboard/npms-dashboard.id.type';
import { NpmsPackageModel } from '../npms-package/npms-package.model';
import { NpmsPackageField } from '../npms-package/npms-package.attributes';
import { NpmsDashboardField } from '../npms-dashboard/npms-dashboard.attributes';


export class NpmsDashboardItemModel extends Model<INpmsDashboardItemAttributes, INpmsDashboardItemCreationAttributes> implements INpmsDashboardItemAttributes {
  // fields
  [NpmsDashboardItemField.id]!: NpmsDashboardItemId;
  [NpmsDashboardItemField.dashboard_id]!: NpmsDashboardId;
  [NpmsDashboardItemField.npms_package_id]!: NpmsPackageId;

  [NpmsDashboardItemField.created_at]!: Date;
  [NpmsDashboardItemField.updated_at]!: Date;


  // acceptable associations
  static associations: NpmsDashboardItemAssociations;

  // eager loaded associations
  [NpmsDashboardItemAssociation.dashboard]?: NpmsDashboardModel;
  [NpmsDashboardItemAssociation.npmsPackage]?: NpmsPackageModel;

  // associations
  getDashboard!: BelongsToGetAssociationMixin<NpmsDashboardModel>;
  getPackage!: BelongsToGetAssociationMixin<NpmsPackageModel>;
}


export const initNpmsDashboardItemModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NpmsDashboardItemModel.init({
    id: AutoIncrementingId,
    dashboard_id: {
      type: DataTypes.INTEGER,
      references: { model: NpmsDashboardModel as typeof Model, key: NpmsDashboardField.id },
      unique: 'dashboard_id_npms_package_id',
      allowNull: false,
    },
    npms_package_id: {
      type: DataTypes.INTEGER,
      references: { model: NpmsPackageModel as typeof Model, key: NpmsPackageField.id },
      unique: 'dashboard_id_npms_package_id',
      allowNull: false,
    },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: 'npms_dashboard_items',
    ...AuditableSchema,
  });
}
