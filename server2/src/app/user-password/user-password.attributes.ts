import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { UserId } from "../user/user.id.type";
import { UserPasswordId } from "./user-password.id.type";

export interface IUserPasswordAttributes extends IAuditable {
  id: UserPasswordId;
  user_id: UserId;
  salt: string;
  hash: string;
}

export const UserPasswordField: K2K<IUserPasswordAttributes> = {
  id: 'id',
  user_id: 'user_id',
  salt: 'salt',
  hash: 'hash',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export interface IUserPasswordCreationAttributes extends Optional<IUserPasswordAttributes,
  | id
  | created_at
  | updated_at
> {}
