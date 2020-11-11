import { Sequelize } from "sequelize";
import { Mutex } from 'async-mutex';
import { PermissionModel } from "../../app/permission/permission.model";
import { RoleAssociation } from "../../app/role/role.associations";
import { Role } from "../../app/role/role.const";
import { RoleModel } from "../../app/role/role.model";
import { EnvService } from "../environment/env";
import { OrNull } from "../types/or-null.type";
import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "../helpers/ist.helper";
import { InvalidatingCache, isCacheResult } from "../helpers/invalidating-cache.helper";


export interface IPublicAuthorisationValue { role: RoleModel; permissions: PermissionModel[]; };
export class PublicAuthorisation {
  // invalidates every minute
  protected _cache: InvalidatingCache<IPublicAuthorisationValue> = new InvalidatingCache(60_000);
  protected _lock = new Mutex();

  constructor(
    protected readonly env: EnvService,
    protected readonly sequelize: Sequelize,
  ) {
    //
  }

  /**
   * Caches public permissions & role to append to every request
   * Data is cached to avoid re-fetching on every request
   *
   * Public permissions can be modified in the application
   * TODO: update the cache when they are modified
   */
  async retrieve(): Promise<IPublicAuthorisationValue> {
    const unlock = await this._lock.acquire();
    try {
      const cacheResult = this._cache.get();
      if (isCacheResult.valid(cacheResult)) return cacheResult.value;
      const role = await RoleModel.findByPk(
        Role.Public,
        { include: [{ association: RoleAssociation.permissions, }], },
      );
      if (!role) { throw new Error('Failed to retrieve public role...'); }
      const permissions = role.permissions;
      if (!permissions) { throw new Error('Failed to retrieve public permissions...'); }
      const result: IPublicAuthorisationValue = { permissions, role };
      this._cache.set(result);
      return result;
    } catch (error) {
      throw error;
    } finally {
      unlock();
    }
  }
}