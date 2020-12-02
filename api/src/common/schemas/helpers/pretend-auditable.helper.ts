import { DataType } from "sequelize";
import { $TS_DANGER } from "../../types/$ts-danger.type";
import { created_at } from "../constants/created_at.const";
import { updated_at } from "../constants/updated_at.const";


// makes typescript + sequelize happy that we've handled timestamps...
export const pretendAuditable: { [created_at]: DataType, [updated_at]: DataType } = {} as $TS_DANGER<any>;
