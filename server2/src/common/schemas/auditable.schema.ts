import { createdAt, created_at } from "./constants/created_at.const";
import { updatedAt, updated_at } from "./constants/updated_at.const";

// https://sequelize.org/v5/manual/models-definition.html#timestamps
export const AuditableSchema = {
  timestamps: true,
  [createdAt]: created_at,
  [updatedAt]: updated_at,
} as const;
