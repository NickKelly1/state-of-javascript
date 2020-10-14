import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";

export interface IAuditable {
  [created_at]: Date;
  [updated_at]: Date;
}