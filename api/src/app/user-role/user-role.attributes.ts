import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { UserRoleId } from "../user-role/user-role.id.type";
import { UserId } from "../user/user.id.type";

export interface IUserRoleAttributes extends IAuditable {
  id: UserRoleId;
  user_id: UserId;
  role_id: UserId;
}

export const UserRoleField: K2K<IUserRoleAttributes> = {
  id: 'id',
  role_id: 'role_id',
  user_id: 'user_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export interface IUserRoleCreationAttributes extends Optional<IUserRoleAttributes,
  | id
  | created_at
  | updated_at
> {}

