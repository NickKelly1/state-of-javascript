import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { UserId } from "../user/user.id.type";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { UserTokenTypeId } from "./user-token-type.id.type";
import { OrNull } from "../../common/types/or-null.type";

export interface IUserTokenTypeAttributes extends IAuditable {
  id: UserTokenTypeId;
  name: string;
}

export const UserTokenTypeField: K2K<IUserTokenTypeAttributes> = {
  id: 'id',
  name: 'name',
  [created_at]: created_at,
  [updated_at]: updated_at,
}

export interface IUserTokenTypeCreationAttributes extends Optional<IUserTokenTypeAttributes,
  | id
  | created_at
  | updated_at
> {}

