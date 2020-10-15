import { OrNullable } from "../../types/or-nullable.type";

export interface UserCmsData {
  id: number;
  firstname: OrNullable<string>;
  lastname: OrNullable<string>;
  username: OrNullable<string>;
}
