import { Op } from "sequelize";
import { Mutex } from 'async-mutex';
import { PermissionModel } from "../../app/permission/permission.model";
import { RoleAssociation } from "../../app/role/role.associations";
import { Role } from "../../app/role/role.const";
import { RoleModel } from "../../app/role/role.model";
import { CacheState, InvalidatingCache, isCacheResult } from "../helpers/invalidating-cache.helper";
import { RoleField } from "../../app/role/role.attributes";
import { assertDefined } from "../helpers/assert-defined.helper";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { InitialisationException } from "../exceptions/types/initialisation-exception";
import { logger } from "../logger/logger";
import { RedisChannel } from "../../app/db/redis.channel.const";
import { invoke } from "../helpers/invoke.helper";


export interface ISystemPermissionValue { authenticated: PermissionModel[]; pub: PermissionModel[]; }
export class SystemPermissionsService {
  // invalidates every minute to ensure recent permissions...
  // we also relies on redis subscription to invalidate cache
  protected _cache: InvalidatingCache<ISystemPermissionValue> = new InvalidatingCache(60_000);
  protected _lock = new Mutex();
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected _unsubs: Function[] = [];

  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    this._handleSystemPermissionsUpdated = this._handleSystemPermissionsUpdated.bind(this);
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}...`);
    this._initialised = true;
    await this._up();
  }

  /**
   * Spin the service up
   */
  protected async _up(): Promise<void> {
    this._unsubs.push(this.universal.redisService.subscribe({
      channel: RedisChannel.sys_permissions.name,
      message: RedisChannel.sys_permissions.messages.updated,
      cb: this._handleSystemPermissionsUpdated,
    }));
  }

  /**
   * Spin the service down
   */
  protected async _down(): Promise<void>  {
    this._unsubs.forEach(invoke);
  }

  /**
   * Handle updating of system permissions...
   */
  protected async _handleSystemPermissionsUpdated(): Promise<void> {
    const unlock = await this._lock.acquire();
    try {
      logger.info(`[${this.constructor.name}::${this._handleSystemPermissionsUpdated.name}] System permissions updated, invalidating cache... `)
      this._cache.invalidate();
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      unlock();
    }
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
    logger.debug(`[${this.constructor.name}::getPermissions::1] Getting System Permissions...`);
    try {
      const cacheResult = this._cache.get();
      logger.debug(`[${this.constructor.name}::getPermissions::2]: ${CacheState[cacheResult.state]}`);
      if (isCacheResult.valid(cacheResult)) { return cacheResult.value; }
      logger.debug(`[${this.constructor.name}::getPermissions::3]: System Permission stale... Re-fetching`);
      const roles = await RoleModel.findAll({
        where: { [RoleField.id]: { [Op.in]: [Role.Authenticated, Role.Public] } },
        include: [{ association: RoleAssociation.permissions, }],
      });
      const pub = assertDefined(roles.find(role => role.isPublic())?.permissions);
      const authenticated = assertDefined(roles.find(role => role.isAuthenticated())?.permissions);
      const result: ISystemPermissionValue = { pub, authenticated, };
      logger.debug(`[${this.constructor.name}::getPermissions::4] Finished`);
      this._cache.set(result);
      return result;
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      unlock();
    }
  }
}