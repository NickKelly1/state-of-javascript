import DataLoader from 'dataloader';
// import Dataloader from 'dataloader';
import { Op } from 'sequelize';
import { BlogPostCommentField } from '../../app/blog-post-comment/blog-post-comment.attributes';
import { BlogPostCommentId } from '../../app/blog-post-comment/blog-post-comment.id.type';
import { BlogPostStatusField } from '../../app/blog-post-status/blog-post-status.attributes';
import { BlogPostStatusId } from '../../app/blog-post-status/blog-post-status.id.type';
import { BlogPostField } from '../../app/blog-post/blog-post.attributes';
import { BlogPostId } from '../../app/blog-post/blog-post.id.type';
import { QueryRunner } from '../../app/db/query-runner';
import { FileField } from '../../app/file/file.attributes';
import { FileId } from '../../app/file/file.id.type';
import { FileModel } from '../../app/file/file.model';
import { ImageField } from '../../app/image/image.attributes';
import { ImageId } from '../../app/image/image.id.type';
import { ImageModel } from '../../app/image/image.model';
import { NewsArticleStatusId } from '../../app/news-article-status/news-article-status.id.type';
import { NewsArticleField } from '../../app/news-article/news-article.attributes';
import { NewsArticleId } from '../../app/news-article/news-article.id.type';
import { NpmsDashboardItemField } from '../../app/npms-dashboard-item/npms-dashboard-item.attributes';
import { NpmsDashboardItemId } from '../../app/npms-dashboard-item/npms-dashboard-item.id.type';
import { NpmsDashboardStatusId } from '../../app/npms-dashboard-status/npms-dashboard-status.id.type';
import { NpmsDashboardId } from '../../app/npms-dashboard/npms-dashboard.id.type';
import { NpmsPackageField } from '../../app/npms-package/npms-package.attributes';
import { NpmsPackageId } from '../../app/npms-package/npms-package.id.type';
import { PermissionCategoryId } from '../../app/permission-category/permission-category-id.type';
import { PermissionCategoryField } from '../../app/permission-category/permission-category.attributes';
import { PermissionCategoryModel } from '../../app/permission-category/permission-category.model';
import { PermissionId } from '../../app/permission/permission-id.type';
import { PermissionField } from '../../app/permission/permission.attributes';
import { RolePermissionId } from '../../app/role-permission/role-permission.id.type';
import { RoleField } from '../../app/role/role.attributes';
import { RoleId } from '../../app/role/role.id.type';
import { UserRoleField } from '../../app/user-role/user-role.attributes';
import { UserRoleId } from '../../app/user-role/user-role.id.type';
import { UserField } from '../../app/user/user.attributes';
import { UserId } from '../../app/user/user.id.type';
import { UserModel } from '../../app/user/user.model';
import {
  BlogPostCommentModel,
  BlogPostModel,
  BlogPostStatusModel,
  NewsArticleModel,
  NewsArticleStatusModel,
  NpmsDashboardItemModel,
  NpmsDashboardModel,
  NpmsDashboardStatusModel,
  NpmsPackageModel,
  PermissionModel,
  RoleModel,
  RolePermissionModel,
  UserRoleModel,
} from '../../circle';
import { BaseContext } from '../context/base.context';
import { OrNull } from '../types/or-null.type';

export type IUserDataLoader = DataLoader<UserId, OrNull<UserModel>>;
export type IUserRoleDataLoader = DataLoader<UserRoleId, OrNull<UserRoleModel>>;
export type IRoleDataLoader = DataLoader<RoleId, OrNull<RoleModel>>;
export type IRolePermissionDataLoader = DataLoader<RolePermissionId, OrNull<RolePermissionModel>>;
export type IPermissionCategoryDataLoader = DataLoader<PermissionCategoryId, OrNull<PermissionCategoryModel>>;
export type IPermissionDataLoader = DataLoader<PermissionId, OrNull<PermissionModel>>;
export type INewsArticleDataLoader = DataLoader<NewsArticleId, OrNull<NewsArticleModel>>;
export type INewsArticleStatusDataLoader = DataLoader<NewsArticleStatusId, OrNull<NewsArticleStatusModel>>;
export type IBlogPostDataLoader = DataLoader<BlogPostId, OrNull<BlogPostModel>>;
export type IImageDataLoader = DataLoader<ImageId, OrNull<ImageModel>>;
export type IFileDataLoader = DataLoader<FileId, OrNull<FileModel>>;
export type IBlogPostCommentDataLoader = DataLoader<BlogPostCommentId, OrNull<BlogPostCommentModel>>;
export type IBlogPostStatusDataLoader = DataLoader<BlogPostStatusId, OrNull<BlogPostStatusModel>>;
export type INpmsPackageDataLoader = DataLoader<NpmsPackageId, OrNull<NpmsPackageModel>>;
export type INpmsDashboardDataLoader = DataLoader<NpmsDashboardId, OrNull<NpmsDashboardModel>>;
export type INpmsDashboardStatusDataLoader = DataLoader<NpmsDashboardStatusId, OrNull<NpmsDashboardStatusModel>>;
export type INpmsDashboardItemDataLoader = DataLoader<NpmsDashboardItemId, OrNull<NpmsDashboardItemModel>>;

export class Loader {
  protected readonly runner: OrNull<QueryRunner>;
  protected readonly ctx: BaseContext;

  constructor(arg: {
    ctx: BaseContext,
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
    this._users = new DataLoader(async (keys): Promise<(OrNull<UserModel>)[]> => {
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
    this._roles = new DataLoader(async (keys): Promise<(OrNull<RoleModel>)[]> => {
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
    this._userRoles = new DataLoader(async (keys): Promise<(OrNull<UserRoleModel>)[]> => {
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

  // ================================
  // ===== permission-category ======
  // ================================
  protected _permissionCategories?: IPermissionCategoryDataLoader;
  public get permissionCategories(): IPermissionCategoryDataLoader {
    if (this._permissionCategories) return this._permissionCategories;
    this._permissionCategories = new DataLoader(async (keys): Promise<(OrNull<PermissionCategoryModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.permissionCategoryRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { [PermissionCategoryField.id]: { [Op.in]: keys as PermissionCategoryId[] } }, },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    })
    return this._permissionCategories;
  }


  // =======================
  // ===== permission ======
  // =======================
  protected _permissions?: IPermissionDataLoader;
  public get permissions(): IPermissionDataLoader {
    if (this._permissions) return this._permissions;
    this._permissions = new DataLoader(async (keys): Promise<(OrNull<PermissionModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.permissionRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { [PermissionField.id]: { [Op.in]: keys as PermissionId[] } }, },
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
    this._rolePermissions = new DataLoader(async (keys): Promise<(OrNull<RolePermissionModel>)[]> => {
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
        options: { where: { [NewsArticleField.id]: { [Op.in]: keys as NewsArticleId[] } } },
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

  // ======================
  // ===== blog-post ======
  // ======================
  protected _blogPost?: IBlogPostDataLoader;
  public get blogPosts(): IBlogPostDataLoader {
    if (this._blogPost) return this._blogPost;
    this._blogPost = new DataLoader(async (keys): Promise<(OrNull<BlogPostModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.blogPostRepository.findAll({
          runner,
          unscoped: true,
        options: { where: { [BlogPostField.id]: { [Op.in]: keys as BlogPostId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._blogPost;
  }

  // ==============================
  // ===== blog-post-comment ======
  // ==============================
  protected _blogPostComment?: IBlogPostCommentDataLoader;
  public get blogPostComments(): IBlogPostCommentDataLoader {
    if (this._blogPostComment) return this._blogPostComment;
    this._blogPostComment = new DataLoader(async (keys): Promise<(OrNull<BlogPostCommentModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.blogPostCommentRepository.findAll({
          runner,
          unscoped: true,
        options: { where: { [BlogPostCommentField.id]: { [Op.in]: keys as BlogPostCommentId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._blogPostComment;
  }

  // =============================
  // ===== blog-post-status ======
  // =============================
  protected _blogPostStatus?: IBlogPostStatusDataLoader;
  public get blogPostStatus(): IBlogPostStatusDataLoader {
    if (this._blogPostStatus) return this._blogPostStatus;
    this._blogPostStatus = new DataLoader(async (keys): Promise<(OrNull<BlogPostStatusModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.blogPostStatusRepository.findAll({
          runner,
          unscoped: true,
        options: { where: { [BlogPostStatusField.id]: { [Op.in]: keys as BlogPostStatusId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._blogPostStatus;
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
        options: { where: { [NpmsPackageField.id]: { [Op.in]: keys as NpmsPackageId[] } } },
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

  // =================================
  // ===== npm-dashboard-status ======
  // =================================
  protected _npmsDashboardStatus?: INpmsDashboardStatusDataLoader;
  public get npmsDashboardStatus(): INpmsDashboardStatusDataLoader {
    if (this._npmsDashboardStatus) return this._npmsDashboardStatus;
    this._npmsDashboardStatus = new DataLoader(async (keys): Promise<(OrNull<NpmsDashboardStatusModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.npmsDashboardStatusRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { id: { [Op.in]: keys as NpmsDashboardStatusId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._npmsDashboardStatus;
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
        options: { where: { [NpmsDashboardItemField.id]: { [Op.in]: keys as NpmsDashboardItemId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null);
    });
    return this._npmsDashboardItem;
  }

  // ==================
  // ===== image ======
  // ==================
  protected _image?: IImageDataLoader;
  public get images(): IImageDataLoader {
    if (this._image) return this._image;
    this._image = new DataLoader(async (keys): Promise<(OrNull<ImageModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.imageRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { [ImageField.id]: { [Op.in]: keys as ImageId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._image;
  }

  // =================
  // ===== file ======
  // =================
  protected _file?: IFileDataLoader;
  public get files(): IFileDataLoader {
    if (this._file) return this._file;
    this._file = new DataLoader(async (keys): Promise<(OrNull<FileModel>)[]> => {
      const { runner } = this;
      const models = await this.ctx.services.fileRepository.findAll({
        runner,
        unscoped: true,
        options: { where: { [FileField.id]: { [Op.in]: keys as FileId[] } } },
      });
      const map = new Map(models.map(model => [model.id, model]));
      return keys.map(key => map.get(key) ?? null)
    });
    return this._file;
  }
}