import { BelongsToManyGetAssociationsMixin, DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import { NpmsDashboardItemModel } from "../../circle";
import { AuditableSchema } from "../../common/schemas/auditable.schema";
import { AutoIncrementingId } from "../../common/schemas/auto-incrementing-id.schema";
import { pretendAuditable } from "../../common/schemas/helpers/pretend-auditable.helper";
import { pretendSoftDeleteable } from "../../common/schemas/helpers/pretend-soft-deleteable.helper";
import { ModelInitFn } from "../../common/schemas/interfaces/model-init-fn.interface";
import { SoftDeleteableSchema } from "../../common/schemas/soft-deleteable.schema";
import { OrNull } from "../../common/types/or-null.type";
import { NpmsDashboardModel } from "../npms-dashboard/npms-dashboard.model";
import { NpmsPackageInfo } from "./api/npms-api.package-info.type";
import { NpmsPackageAssociation, NpmsPackageAssociations, } from "./npms-package.associations";
import { INpmsPackageAttributes, INpmsPackageCreationAttributes, NpmsPackageField } from "./npms-package.attributes";
import { NpmsPackageDefinition } from "./npms-package.definition";
import { NpmsPackageId } from "./npms-package.id.type";

export class NpmsPackageModel extends Model<INpmsPackageAttributes, INpmsPackageCreationAttributes> implements INpmsPackageAttributes {
  // fields
  [NpmsPackageField.id]!: NpmsPackageId;
  [NpmsPackageField.name]!: string;
  [NpmsPackageField.data]!: OrNull<NpmsPackageInfo>;
  [NpmsPackageField.last_ran_at]!: Date;
  [NpmsPackageField.created_at]!: Date;
  [NpmsPackageField.updated_at]!: Date;
  [NpmsPackageField.deleted_at]!: OrNull<Date>;

  // acceptable associations
  static associations: NpmsPackageAssociations;

  // eager loaded associations
  [NpmsPackageAssociation.dashboard_items]?: NpmsDashboardItemModel[];
  [NpmsPackageAssociation.dashboards]?: NpmsDashboardModel[];

  // associations
  getDashboardItems!: HasManyGetAssociationsMixin<NpmsDashboardItemModel>;
  getDashboards!: BelongsToManyGetAssociationsMixin<NpmsDashboardModel>;
}


export const initNpmsModel: ModelInitFn = (arg) => {
  const { sequelize, env } = arg;
  NpmsPackageModel.init({
    id: AutoIncrementingId,
    name: { type: DataTypes.STRING(NpmsPackageDefinition.name.max), unique: true, allowNull: false, },
    last_ran_at: { type: DataTypes.DATE, allowNull: false, },
    data: { type: DataTypes.JSONB, allowNull: true, },
    ...pretendAuditable,
    ...pretendSoftDeleteable,
  }, {
    sequelize: sequelize,
    tableName: 'npms_packages',
    ...AuditableSchema,
    ...SoftDeleteableSchema,
  });
}
