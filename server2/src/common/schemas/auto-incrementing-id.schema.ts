import { DataTypes } from "sequelize";

export const AutoIncrementingId = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
} as const;