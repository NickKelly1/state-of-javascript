import { Sequelize } from "sequelize";
import { Mutex } from 'async-mutex';
import { PermissionModel } from "../../app/permission/permission.model";
import { RoleAssociation } from "../../app/role/role.associations";
import { Role } from "../../app/role/role.const";
import { RoleModel } from "../../app/role/role.model";
import { EnvService } from "../environment/env";
import { OrNull } from "../types/or-null.type";

export class PublicAuthorisation {
  protected _cached: OrNull<{ role: RoleModel; permissions: PermissionModel[]; }> = null;
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
  async retrieve(): Promise<{ role: RoleModel, permissions: PermissionModel[] }> {
    if (this._cached) return this._cached;

    const unlock = await this._lock.acquire();
    try {
      // TODO: re-fetch on update...
      const role = await RoleModel.findByPk(Role.Public, {
        include: [{
          association: RoleAssociation.permissions,
        }],
      });
      if (!role) { throw new Error('Failed to retrieve public role...'); }
      const permissions = role.permissions;
      if (!permissions) { throw new Error('Failed to retrieve public permissions...'); }
      this._cached = { permissions, role };
      return { role, permissions };
    } catch (error) {
      throw error;
    } finally {
      unlock();
    }
  }
}