import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { IJson } from "../../common/interfaces/json.interface";
import { ISoftDeleteable } from "../../common/interfaces/soft-deleteable.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { deleted_at } from "../../common/schemas/constants/deleted_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { OrNull } from "../../common/types/or-null.type";
import { UserTokenTypeId } from "../user-token-type/user-token-type.id.type";
import { UserId } from "../user/user.id.type";
import { UserTokenId } from "./user-token.id.type";

export interface IUserTokenAttributes extends IAuditable, ISoftDeleteable {
  id: UserTokenId;
  user_id: UserId;
  type_id: UserTokenTypeId;
  slug: string;
  redirect_uri: OrNull<string>;
  data: OrNull<IJson>;
  expires_at: OrNull<Date>;
}

export const UserTokenField: K2K<IUserTokenAttributes> = {
  id: 'id',
  user_id: 'user_id',
  type_id: 'type_id',
  slug: 'slug',
  redirect_uri: 'redirect_uri',
  data: 'data',
  expires_at: 'expires_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  deleted_at: 'deleted_at',
}

export interface IUserTokenCreationAttributes extends Optional<IUserTokenAttributes,
  | id
  | created_at
  | updated_at
  | deleted_at
> {}
