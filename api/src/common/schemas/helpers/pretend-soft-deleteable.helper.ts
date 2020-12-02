import { DataType } from "sequelize";
import { $TS_DANGER } from "../../types/$ts-danger.type";
import { deleted_at } from "../constants/deleted_at.const";

// makes typescript + sequelize happy that we've handled timestamps...
export const pretendSoftDeleteable: { [deleted_at]: DataType } = {} as $TS_DANGER<any>;
