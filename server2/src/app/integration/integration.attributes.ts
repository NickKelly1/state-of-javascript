import { Optional } from "sequelize";
import { IAuditable } from "../../common/interfaces/auditable.interface";
import { IJson } from "../../common/interfaces/json.interface";
import { created_at } from "../../common/schemas/constants/created_at.const";
import { id } from "../../common/schemas/constants/id.const";
import { updated_at } from "../../common/schemas/constants/updated_at.const";
import { K2K } from "../../common/types/k2k.type";
import { OrNull } from "../../common/types/or-null.type";
import { IntegrationId } from "./integration-id.type";

export interface IIntegrationAttributes extends IAuditable {
  id: IntegrationId;

  name: string;

  // for encryption
  iv: string;

  // encrypted init
  encrypted_init: OrNull<string>;

  // encrypted state
  encrypted_state: OrNull<string>;

  // publicly visible data
  public: OrNull<string>;

  // encrypted data
  error: OrNull<string>;

  // is connected?
  is_connected: boolean;
}

export const IntegrationField: K2K<IIntegrationAttributes> = {
  id: 'id',
  name: 'name',
  iv: 'iv',
  encrypted_init: 'encrypted_init',
  encrypted_state: 'encrypted_state',
  public: 'public',
  is_connected: 'is_connected',
  error: 'error',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export interface IIntegrationCreationAttributes extends Optional<IIntegrationAttributes,
  | id
  | created_at
  | updated_at
> {}

