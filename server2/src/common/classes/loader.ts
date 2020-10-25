import Dataloader from 'dataloader';
import { Op } from 'sequelize';
import { QueryRunner } from '../../app/db/query-runner';
import { PermissionId } from '../../app/permission/permission-id.type';
import { RolePermissionId } from '../../app/role-permission/role-permission.id.type';
import { RoleField } from '../../app/role/role.attributes';
import { RoleId } from '../../app/role/role.id.type';
import { UserRoleField } from '../../app/user-role/user-role.attributes';
import { UserRoleId } from '../../app/user-role/user-role.id.type';
import { UserField } from '../../app/user/user.attributes';
import { UserId } from '../../app/user/user.id.type';
import { UserModel } from '../../app/user/user.model';
import { PermissionModel, RoleModel, RolePermissionModel, UserRoleModel } from '../../circle';
import { IRequestContext } from '../interfaces/request-context.interface';
import { OrNull } from '../types/or-null.type';

export type IUserDataLoader = Dataloader<UserId, OrNull<UserModel>>;
export type IUserRoleDataLoader = Dataloader<UserRoleId, OrNull<UserRoleModel>>;
export type IRoleDataLoader = Dataloader<RoleId, OrNull<RoleModel>>;
export type IRolePermissionDataLoader = Dataloader<RolePermissionId, OrNull<RolePermissionModel>>;
export type IPermissionDataLoader = Dataloader<PermissionId, OrNull<PermissionModel>>;

export class Loader {
  protected readonly runner: OrNull<QueryRunner>;
  protected readonly ctx: IRequestContext;

  constructor(arg: {
    ctx: IRequestContext,
    runner?: QueryRunner,
  }) {
    const { ctx, runner } = arg;
    this.ctx = ctx;
    this.runner = runner ?? null;
  }

  // =================
  // ===== user ======
  // =================
  protected _users?: IUserDataLoader;
  public get users(): IUserDataLoader {
    if (this._users) return this._users;
    this._users = new Dataloader(async (keys): Promise<(OrNull<UserModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.userRepository().findAll({
        runner,
        options: { where: { [UserField.id]: { [Op.in]: keys as UserId[] } }, }
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._users;
  }

  // =================
  // ===== role ======
  // =================
  protected _roles?: IRoleDataLoader;
  public get roles(): IRoleDataLoader {
    if (this._roles) return this._roles;
    this._roles = new Dataloader(async (keys): Promise<(OrNull<RoleModel>)[]> => {
      const { runner } = this;
      const model = await this.ctx.services.roleRepository().findAll({
        runner,
        options: { where: { [RoleField.id]: { [Op.in]: keys as RoleId[] } }, },
      });
      const map = new Map(model.map(user => [user.id, user]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._roles;
  }

  // ======================
  // ===== user-role ======
  // =======================
  protected _userRoles?: IUserRoleDataLoader;
  public get userRoles(): IUserRoleDataLoader {
    if (this._userRoles) return this._userRoles;
    this._userRoles = new Dataloader(async (keys): Promise<(OrNull<UserRoleModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.userRoleRepository().findAll({
        runner,
        options: { where: { [UserRoleField.id]: { [Op.in]: keys as UserRoleId[] } }, },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._userRoles;
  }

  // =======================
  // ===== permission ======
  // =======================
  protected _permissions?: IPermissionDataLoader;
  public get permissions(): IPermissionDataLoader {
    if (this._permissions) return this._permissions;
    this._permissions = new Dataloader(async (keys): Promise<(OrNull<PermissionModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.permissionRepository().findAll({
        runner,
        options: { where: { id: { [Op.in]: keys as PermissionId[] } }, },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._permissions;
  }

  // ============================
  // ===== role-permission ======
  // ============================
  protected _rolePermissions?: IRolePermissionDataLoader;
  public get rolePermissions(): IRolePermissionDataLoader {
    if (this._rolePermissions) return this._rolePermissions;
    this._rolePermissions = new Dataloader(async (keys): Promise<(OrNull<RolePermissionModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.rolePermissionRepository().findAll({
        runner,
        options: { where: { id: { [Op.in]: keys as RolePermissionId[] } }, },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._rolePermissions;
  }
}