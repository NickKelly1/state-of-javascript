import { Model, DataTypes, HasManyGetAssociationsMixin, BelongsToManyGetAssociationsMixin, } from 'sequelize';
import { AuditableSchema } from '../../common/schemas/auditable.schema';
import { AutoIncrementingId } from '../../common/schemas/auto-incrementing-id.schema';
import { pretendAuditable } from '../../common/schemas/helpers/pretend-auditable.helper';
import { ModelInitFn } from '../../common/schemas/interfaces/model-init-fn.interface';
import { NpmsDashboardAssociation, NpmsDashboardAssociations } from './npms-dashboard.associations';
import { NpmsDashboardId } from './npms-dashboard.id.type';
import { pretendSoftDeleteable } from '../../common/schemas/helpers/pretend-soft-deleteable.helper';
import { NpmsDashboardDefinition } from './npms-dashboard.definition';
import { SoftDeleteableSchema } from '../../common/schemas/soft-deleteable.schema';
import { INpmsDashboardAttributes, INpmsDashboardCreationAttributes, NpmsDashboardField } from './npms-dashboard.attributes';
import { NpmsDashboardItemModel } from '../../circle';


export class NpmsDashboardModel extends Model<INpmsDashboardAttributes, INpmsDashboardCreationAttributes> implements INpmsDashboardAttributes {
  // fields
  [NpmsDashboardField.id]!: NpmsDashboardId;
  [NpmsDashboardField.name]!: string;
  [NpmsDashboardField.order]!: number;

  [NpmsDashboardField.created_at]!: Date;
  [NpmsDashboardField.updated_at]!: Date;
  [NpmsDashboardField.deleted_at]!: Date;

  // acceptable associations
  static associations: NpmsDashboardAssociations;

  // eager loaded associations
  [NpmsDashboardAssociation.items]?: NpmsDashboardItemModel[];
  [NpmsDashboardAssociation.npmsPackages]?: NpmsDashboardModel[];

  // associations
  getItems!: HasManyGetAssociationsMixin<NpmsDashboardItemModel>;
  getNpmsPackages!: BelongsToManyGetAssociationsMixin<NpmsDashboardModel>;
}


export const initNpmsDashboardModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NpmsDashboardModel.init({
    id: AutoIncrementingId,
    name: { type: DataTypes.STRING(NpmsDashboardDefinition.name.max), allowNull: false, },
    order: { type: DataTypes.INTEGER, allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'npms_dashboards',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
