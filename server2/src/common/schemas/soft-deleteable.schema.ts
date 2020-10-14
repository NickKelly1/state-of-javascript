import { created_at } from "./constants/created_at.const";
import { deletedAt, deleted_at } from "./constants/deleted_at.const";
import { updated_at } from "./constants/updated_at.const";

// https://sequelize.org/v5/manual/models-definition.html#timestamps
export const SoftDeleteableSchema = {
  paranoid: true,
  [deletedAt]: deleted_at,
} as const;