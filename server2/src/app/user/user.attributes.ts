import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { UserId } from "../user/user.id.type";

export interface IUserAttributes extends IAuditable, ISoftDeleteable {
  id: UserId;
  name: string;
}

export const UserField: K2K<IUserAttributes> = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  updated_at: 'updated_at',
}

export interface IUserCreationAttributes extends Optional<IUserAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}

