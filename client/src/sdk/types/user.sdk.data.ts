import { OrNullable } from "../../types/or-nullable.type";

export interface UserSdkData {
  id: number;
  firstname: OrNullable<string>;
  lastname: OrNullable<string>;
  username: OrNullable<string>;
}
