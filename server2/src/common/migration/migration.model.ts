import { DataTypes, Model } from "sequelize";
import { AuditableSchema } from "../schemas/auditable.schema";
import { AutoIncrementingId } from "../schemas/auto-incrementing-id.schema";
import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";
import { pretendAuditable } from "../schemas/helpers/pretend-auditable.helper";
import { ModelInitFn } from "../schemas/interfaces/model-init-fn.interface";
import { IMigrationAttributes, IMigrationCreationAttributes } from "./migraiton.attributes";
import { _migrations } from "./_migration.const";

export class MigrationModel extends Model<IMigrationAttributes, IMigrationCreationAttributes> implements IMigrationAttributes {
  id!: number;
  path!: string;
  name!: string;
  number!: number;
  batch!: number;
  [created_at]!: Date;
  [updated_at]!: Date;
}

// initialise in sequelize
export const initMigrationModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;
  MigrationModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, },
    name: { type: DataTypes.STRING(600), allowNull: false, },
    path: { type: DataTypes.STRING(300), allowNull: false, },
    number: { type: DataTypes.INTEGER, unique: true, allowNull: false, },
    batch: { type: DataTypes.INTEGER, allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: _migrations,
    ...AuditableSchema,
  });
}