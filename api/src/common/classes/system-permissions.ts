import { Op, Sequelize } from "sequelize";
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
import { RoleField } from "../../app/role/role.attributes";
import { assertDefined } from "../helpers/assert-defined.helper";
import { logger } from "../logger/logger";


export interface ISystemPermissionValue { authenticated: PermissionModel[]; pub: PermissionModel[]; };
export class SystemPermissions {
  // invalidates every minute
  // protected _cache: InvalidatingCache<ISystemPermissionValue> = new InvalidatingCache(60_000);
  protected _cache: InvalidatingCache<ISystemPermissionValue> = new InvalidatingCache(20_000);
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
  async getPermissions(): Promise<ISystemPermissionValue> {
    const unlock = await this._lock.acquire();
    try {
      const cacheResult = this._cache.get();
      if (isCacheResult.valid(cacheResult)) { return cacheResult.value; }
      const roles = await RoleModel.findAll({
        where: { [RoleField.id]: { [Op.in]: [Role.Authenticated, Role.Public] } },
        include: [{ association: RoleAssociation.permissions, }],
      });
      const pub =  assertDefined(roles.find(role => role.isPublic())?.permissions);
      const authenticated = assertDefined(roles.find(role => role.isAuthenticated())?.permissions);
      const result: ISystemPermissionValue = { pub, authenticated, };
      this._cache.set(result);
      return result;
    } catch (error) {
      throw error;
    } finally {
      unlock();
    }
  }
}