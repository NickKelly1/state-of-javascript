import { created_at } from "./constants/created_at.const";
import { deleted_at } from "./constants/deleted_at.const";
import { id } from "./constants/id.const";
import { updated_at } from "./constants/updated_at.const";

export type DbAutomaticPropery = id | created_at | updated_at | deleted_at;