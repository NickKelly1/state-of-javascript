import { DataTypes, Model } from "sequelize";
import { AuditableSchema } from "../../schemas/auditable.schema";
import { AutoIncrementingId } from "../../schemas/auto-incrementing-id.schema";
import { created_at } from "../../schemas/constants/created_at.const";
import { updated_at } from "../../schemas/constants/updated_at.const";
import { pretendAuditable } from "../../schemas/helpers/pretend-auditable.helper";
import { ModelInitFn } from "../../schemas/interfaces/model-init-fn.interface";
import { _migrations } from "../constants/_migration.const";
import { IMigrationAttributes, IMigrationCreationAttributes } from "./migraiton.attributes";

export class MigrationModel extends Model<IMigrationAttributes, IMigrationCreationAttributes> implements IMigrationAttributes {
  id!: number;
  path!: string;
  file!: string;
  number!: number;
  batch!: number;
  [created_at]!: Date;
  [updated_at]!: Date;
}

// initialise in sequelize
export const initMigrationModel: ModelInitFn = (arg) => {
  const { sequelize } = arg;
  MigrationModel.init({
    id: AutoIncrementingId,
    file: { type: DataTypes.STRING(600), unique: true, allowNull: false, },
    path: { type: DataTypes.STRING(300), unique: true, allowNull: false, },
    number: { type: DataTypes.INTEGER, unique: true, allowNull: false, },
    batch: { type: DataTypes.INTEGER, unique: true, allowNull: false, },
    ...pretendAuditable,
  }, {
    sequelize,
    tableName: _migrations,
    ...AuditableSchema,
  });
}