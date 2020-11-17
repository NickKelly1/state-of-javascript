import DataLoader from 'dataloader';
import Dataloader from 'dataloader';
import { Op } from 'sequelize';
import { QueryRunner } from '../../app/db/query-runner';
import { NewsArticleStatusId } from '../../app/news-article-status/news-article-status.id.type';
import { NewsArticleId } from '../../app/news-article/news-article.id.type';
import { NpmsDashboardItemId } from '../../app/npms-dashboard-item/npms-dashboard-item.id.type';
import { NpmsDashboardId } from '../../app/npms-dashboard/npms-dashboard.id.type';
import { NpmsPackageId } from '../../app/npms-package/npms-package.id.type';
import { PermissionId } from '../../app/permission/permission-id.type';
import { RolePermissionId } from '../../app/role-permission/role-permission.id.type';
import { RoleField } from '../../app/role/role.attributes';
import { RoleId } from '../../app/role/role.id.type';
import { UserRoleField } from '../../app/user-role/user-role.attributes';
import { UserRoleId } from '../../app/user-role/user-role.id.type';
import { UserField } from '../../app/user/user.attributes';
import { UserId } from '../../app/user/user.id.type';
import { UserModel } from '../../app/user/user.model';
import {
  NewsArticleModel,
  NewsArticleStatusModel,
  NpmsDashboardItemModel,
  NpmsDashboardModel,
  NpmsPackageModel,
  PermissionModel,
  RoleModel,
  RolePermissionModel,
  UserRoleModel,
} from '../../circle';
import { IRequestContext } from '../interfaces/request-context.interface';
import { OrNull } from '../types/or-null.type';

export type IUserDataLoader = Dataloader<UserId, OrNull<UserModel>>;
export type IUserRoleDataLoader = Dataloader<UserRoleId, OrNull<UserRoleModel>>;
export type IRoleDataLoader = Dataloader<RoleId, OrNull<RoleModel>>;
export type IRolePermissionDataLoader = Dataloader<RolePermissionId, OrNull<RolePermissionModel>>;
export type IPermissionDataLoader = Dataloader<PermissionId, OrNull<PermissionModel>>;
export type INewsArticleDataLoader = Dataloader<NewsArticleId, OrNull<NewsArticleModel>>;
export type INewsArticleStatusDataLoader = Dataloader<NewsArticleStatusId, OrNull<NewsArticleStatusModel>>;
export type INpmsPackageDataLoader = Dataloader<NpmsPackageId, OrNull<NpmsPackageModel>>;
export type INpmsDashboardDataLoader = Dataloader<NpmsDashboardId, OrNull<NpmsDashboardModel>>;
export type INpmsDashboardItemDataLoader = Dataloader<NpmsDashboardItemId, OrNull<NpmsDashboardItemModel>>;

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
      const models = await this.ctx.services.userRepository.findAll({
        runner,
        unscoped: true,
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
      const model = await this.ctx.services.roleRepository.findAll({
        runner,
        unscoped: true,
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
      const models = await this.ctx.services.userRoleRepository.findAll({
        runner,
        unscoped: true,
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
      const models = await this.ctx.services.permissionRepository.findAll({
        runner,
        unscoped: true,
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
      const models = await this.ctx.services.rolePermissionRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as RolePermissionId[] } }, },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._rolePermissions;
  }

  // ==========================
  // ===== news-articles ======
  // ==========================
  protected _newsArticles?: INewsArticleDataLoader;
  public get newsArticles(): INewsArticleDataLoader {
    if (this._newsArticles) return this._newsArticles;
    this._newsArticles = new DataLoader(async (keys): Promise<(OrNull<NewsArticleModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.newsArticleRepository.findAll({
          runner,
          unscoped: true,
        options: { where: { id: { [Op.in]: keys as NewsArticleId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._newsArticles;
  }

  // ==================================
  // ===== news-article-statuses ======
  // ==================================
  protected _newsArticleStatuses?: INewsArticleStatusDataLoader;
  public get newsArticleStatuses(): INewsArticleStatusDataLoader {
    if (this._newsArticleStatuses) return this._newsArticleStatuses;
    this._newsArticleStatuses = new DataLoader(async (keys): Promise<(OrNull<NewsArticleStatusModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.newsArticleStatusRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as NewsArticleId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    });
    return this._newsArticleStatuses;
  }

  // =========================
  // ===== npms-package ======
  // =========================
  protected _npmsPackage?: INpmsPackageDataLoader;
  public get npmsPackage(): INpmsPackageDataLoader {
    if (this._npmsPackage) return this._npmsPackage;
    this._npmsPackage = new DataLoader(async (keys): Promise<(OrNull<NpmsPackageModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.npmsPackageRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as NpmsPackageId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    });
    return this._npmsPackage;
  }

  // ==========================
  // ===== npm-dashboard ======
  // ==========================
  protected _npmsDashboard?: INpmsDashboardDataLoader;
  public get npmsDashboard(): INpmsDashboardDataLoader {
    if (this._npmsDashboard) return this._npmsDashboard;
    this._npmsDashboard = new DataLoader(async (keys): Promise<(OrNull<NpmsDashboardModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.npmsDashboardRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as NpmsDashboardId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._npmsDashboard;
  }

  // ===============================
  // ===== npm-dashboard-item ======
  // ===============================
  protected _npmsDashboardItem?: INpmsDashboardItemDataLoader;
  public get npmsDashboardItem(): INpmsDashboardItemDataLoader {
    if (this._npmsDashboardItem) return this._npmsDashboardItem;
    this._npmsDashboardItem = new DataLoader(async (keys): Promise<(OrNull<NpmsDashboardItemModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.npmsDashboardItemRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as NpmsDashboardItemId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    });
    return this._npmsDashboardItem;
  }
}