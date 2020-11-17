import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
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
import { NpmsDashboardItemModel, UserModel } from '../../circle';
import { UserId } from '../user/user.id.type';
import { NpmsDashboardStatus } from '../npms-dashboard-status/npms-dashboard-status.const';
import { NpmsDashboardStatusField } from '../npms-dashboard-status/npms-dashboard-status.attributes';
import { NpmsDashboardStatusModel } from '../npms-dashboard-status/npms-dashboard-status.model';


export class NpmsDashboardModel extends Model<INpmsDashboardAttributes, INpmsDashboardCreationAttributes> implements INpmsDashboardAttributes {
  // fields
  [NpmsDashboardField.id]!: NpmsDashboardId;
  [NpmsDashboardField.name]!: string;
  [NpmsDashboardField.order]!: number;
  [NpmsDashboardField.owner_id]!: UserId;
  [NpmsDashboardField.status_id]!: UserId;

  [NpmsDashboardField.created_at]!: Date;
  [NpmsDashboardField.updated_at]!: Date;
  [NpmsDashboardField.deleted_at]!: Date;

  // acceptable associations
  static associations: NpmsDashboardAssociations;

  // eager loaded associations
  [NpmsDashboardAssociation.owner]?: UserModel;
  [NpmsDashboardAssociation.items]?: NpmsDashboardItemModel[];
  [NpmsDashboardAssociation.npmsPackages]?: NpmsDashboardModel[];
  [NpmsDashboardAssociation.status]?: NpmsDashboardStatus;

  // associations
  //

  // helpers
  isDraft() { return this[NpmsDashboardField.status_id] === NpmsDashboardStatus.Draft; }
  isRejected() { return this[NpmsDashboardField.status_id] === NpmsDashboardStatus.Rejected; }
  isSubmitted() { return this[NpmsDashboardField.status_id] === NpmsDashboardStatus.Submitted; }
  isApproved() { return this[NpmsDashboardField.status_id] === NpmsDashboardStatus.Approved; }
  isPublished() { return this[NpmsDashboardField.status_id] === NpmsDashboardStatus.Published; }
}


export const initNpmsDashboardModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NpmsDashboardModel.init({
    id: AutoIncrementingId,
    name: { type: DataTypes.STRING(NpmsDashboardDefinition.name.max), allowNull: false, },
    order: { type: DataTypes.INTEGER, allowNull: false, },
    owner_id: { type: DataTypes.INTEGER, references: { model: UserModel as typeof Model, key: NpmsDashboardField.id }, allowNull: false, },
    status_id: { type: DataTypes.INTEGER, references: { model: NpmsDashboardStatusModel as typeof Model, key: NpmsDashboardStatusField.id }, allowNull: false, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize,
    tableName: 'npms_dashboards',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
