import { AuthSerivce } from "../../app/auth/auth.service";
import { JwtService } from "../../app/auth/jwt.service";
import { NewsArticleStatusPolicy } from "../../app/news-article-status/news-article-status.policy";
import { NewsArticleStatusRepository } from "../../app/news-article-status/news-article-status.repository";
import { NewsArticleStatusService } from "../../app/news-article-status/news-article-status.service";
import { NewsArticlePolicy } from "../../app/news-article/news-article.policy";
import { NewsArticleRepository } from "../../app/news-article/news-article.repository";
import { NewsArticleService } from "../../app/news-article/news-article.service";
import { PermissionPolicy } from "../../app/permission/permission.policy";
import { PermissionRepository } from "../../app/permission/permission.repository";
import { PermissionService } from "../../app/permission/permission.service";
import { RolePermissionPolicy } from "../../app/role-permission/role-permission.policy";
import { RolePermissionRepository } from "../../app/role-permission/role-permission.repository";
import { RolePermissionService } from "../../app/role-permission/role-permission.service";
import { RolePolicy } from "../../app/role/role.policy";
import { RoleRepository } from "../../app/role/role.repository";
import { RoleService } from "../../app/role/role.service";
import { UserPasswordRepository } from "../../app/user-password/user-password.repository";
import { UserPasswordService } from "../../app/user-password/user-password.service";
import { UserRolePolicy } from "../../app/user-role/user-role.policy";
import { UserRoleRepository } from "../../app/user-role/user-role.repository";
import { UserRoleService } from "../../app/user-role/user-role.service";
import { UserPolicy } from "../../app/user/user.policy";
import { UserRepository } from "../../app/user/user.repository";
import { UserService } from "../../app/user/user.service";
import { IRequestContext } from "../interfaces/request-context.interface";
import { IRequestServices } from "../interfaces/request.services.interface";
import { OrUndefined } from "../types/or-undefined.type";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { NpmsPackageService } from "../../app/npms-package/npms-package.service";
import { NpmsPackageRepository } from "../../app/npms-package/npms-package.repository";
import { NpmsPackagePolicy } from "../../app/npms-package/npms-package.policy";
import { NpmsDashboardItemPolicy } from "../../app/npms-dashboard-item/npms-dashboard-item.policy";
import { NpmsDashboardItemRepository } from "../../app/npms-dashboard-item/npms-dashboard-item.repository";
import { NpmsDashboardPolicy } from "../../app/npms-dashboard/npms-dashboard.policy";
import { NpmsDashboardRepository } from "../../app/npms-dashboard/npms-dashboard.repository";
import { NpmsDashboardService } from "../../app/npms-dashboard/npms-dashboard.service";
import { NpmsDashboardItemService } from "../../app/npms-dashboard-item/npms-dashboard-item.service";
import { NpmsDashboardStatusPolicy } from "../../app/npms-dashboard-status/npms-dashboard-status.policy";
import { NpmsDashboardStatusRepository } from "../../app/npms-dashboard-status/npms-dashboard-status.repository";
import { NpmsDashboardStatusService } from "../../app/npms-dashboard-status/npms-dashboard-status.service";

export class RequestSerivceContainer implements IRequestServices {
  constructor(
    protected readonly _ctx: IRequestContext,
    public readonly universal: IUniversalServices,
  ) {
    //
  }

  protected _npmsService: OrUndefined<NpmsPackageService>;
  get npmsPackageService(): NpmsPackageService {
    if (this._npmsService) return this._npmsService;
    this._npmsService = new NpmsPackageService(this._ctx);
    return this._npmsService;
  }

  protected _npmsRepository: OrUndefined<NpmsPackageRepository>;
  get npmsPackageRepository(): NpmsPackageRepository {
    if (this._npmsRepository) return this._npmsRepository;
    this._npmsRepository = new NpmsPackageRepository(this._ctx);
    return this._npmsRepository;
  }

  protected _npmsPolicy: OrUndefined<NpmsPackagePolicy>;
  get npmsPackagePolicy(): NpmsPackagePolicy {
    if (this._npmsPolicy) return this._npmsPolicy;
    this._npmsPolicy = new NpmsPackagePolicy(this._ctx);
    return this._npmsPolicy;
  }

  protected _userService: OrUndefined<UserService>;
  get userService(): UserService {
    if (this._userService) return this._userService;
    this._userService = new UserService(this._ctx);
    return this._userService;
  }

  protected _userRepository: OrUndefined<UserRepository>;
  get userRepository(): UserRepository {
    if (this._userRepository) return this._userRepository;
    this._userRepository = new UserRepository(this._ctx);
    return this._userRepository;
  }

  protected _userPolicy: OrUndefined<UserPolicy>;
  get userPolicy(): UserPolicy {
    if (this._userPolicy) return this._userPolicy;
    this._userPolicy = new UserPolicy(this._ctx);
    return this._userPolicy;
  }

  protected _roleService: OrUndefined<RoleService>;
  get roleService(): RoleService {
    if (this._roleService) return this._roleService;
    this._roleService = new RoleService(this._ctx);
    return this._roleService;
  }

  protected _roleRepository: OrUndefined<RoleRepository>;
  get roleRepository(): RoleRepository {
    if (this._roleRepository) return this._roleRepository;
    this._roleRepository = new RoleRepository(this._ctx);
    return this._roleRepository;
  }

  protected _rolePolicy: OrUndefined<RolePolicy>
  get rolePolicy(): RolePolicy {
    if (this._rolePolicy) return this._rolePolicy;
    this._rolePolicy = new RolePolicy(this._ctx);
    return this._rolePolicy;
  }

  protected _permissionService: OrUndefined<PermissionService>
  get permissionService(): PermissionService {
    if (this._permissionService) return this._permissionService;
    this._permissionService = new PermissionService(this._ctx);
    return this._permissionService;
  }

  protected _permissionRepository: OrUndefined<PermissionRepository>
  get permissionRepository(): PermissionRepository {
    if (this._permissionRepository) return this._permissionRepository;
    this._permissionRepository = new PermissionRepository(this._ctx);
    return this._permissionRepository;
  }

  protected _permissionPolicy: OrUndefined<PermissionPolicy>
  get permissionPolicy(): PermissionPolicy {
    if (this._permissionPolicy) return this._permissionPolicy;
    this._permissionPolicy = new PermissionPolicy(this._ctx);
    return this._permissionPolicy;
  }

  protected _userRoleService: OrUndefined<UserRoleService>
  get userRoleService(): UserRoleService {
    if (this._userRoleService) return this._userRoleService;
    this._userRoleService = new UserRoleService(this._ctx);
    return this._userRoleService;
  }

  protected _userRoleRepository: OrUndefined<UserRoleRepository>
  get userRoleRepository(): UserRoleRepository {
    if (this._userRoleRepository) return this._userRoleRepository;
    this._userRoleRepository = new UserRoleRepository(this._ctx);
    return this._userRoleRepository;
  }

  protected _userRolePolicy: OrUndefined<UserRolePolicy>
  get userRolePolicy(): UserRolePolicy {
    if (this._userRolePolicy) return this._userRolePolicy;
    this._userRolePolicy = new UserRolePolicy(this._ctx);
    return this._userRolePolicy;
  }

  protected _rolePermissionService: OrUndefined<RolePermissionService>
  get rolePermissionService(): RolePermissionService {
    if (this._rolePermissionService) return this._rolePermissionService;
    this._rolePermissionService = new RolePermissionService(this._ctx);
    return this._rolePermissionService;
  }

  protected _rolePermissionRepository: OrUndefined<RolePermissionRepository>
  get rolePermissionRepository(): RolePermissionRepository {
    if (this._rolePermissionRepository) return this._rolePermissionRepository;
    this._rolePermissionRepository = new RolePermissionRepository(this._ctx);
    return this._rolePermissionRepository;
  }

  protected _rolePermissionPolicy: OrUndefined<RolePermissionPolicy>
  get rolePermissionPolicy(): RolePermissionPolicy {
    if (this._rolePermissionPolicy) return this._rolePermissionPolicy;
    this._rolePermissionPolicy = new RolePermissionPolicy(this._ctx);
    return this._rolePermissionPolicy;
  }

  protected _newsArticleService: OrUndefined<NewsArticleService>
  get newsArticleService(): NewsArticleService {
    if (this._newsArticleService) return this._newsArticleService;
    this._newsArticleService = new NewsArticleService(this._ctx);
    return this._newsArticleService;
  }

  protected _newsArticleRepository: OrUndefined<NewsArticleRepository>
  get newsArticleRepository(): NewsArticleRepository {
    if (this._newsArticleRepository) return this._newsArticleRepository;
    this._newsArticleRepository = new NewsArticleRepository(this._ctx);
    return this._newsArticleRepository;
  }

  protected _newsArticlePolicy: OrUndefined<NewsArticlePolicy>
  get newsArticlePolicy(): NewsArticlePolicy {
    if (this._newsArticlePolicy) return this._newsArticlePolicy;
    this._newsArticlePolicy = new NewsArticlePolicy(this._ctx);
    return this._newsArticlePolicy;
  }

  protected _newsArticleStatusService: OrUndefined<NewsArticleStatusService>
  get newsArticleStatusService(): NewsArticleStatusService {
    if (this._newsArticleStatusService) return this._newsArticleStatusService;
    this._newsArticleStatusService = new NewsArticleStatusService(this._ctx);
    return this._newsArticleStatusService;
  }

  protected _newsArticleStatusRepository: OrUndefined<NewsArticleStatusRepository>
  get newsArticleStatusRepository(): NewsArticleStatusRepository {
    if (this._newsArticleStatusRepository) return this._newsArticleStatusRepository;
    this._newsArticleStatusRepository = new NewsArticleStatusRepository(this._ctx);
    return this._newsArticleStatusRepository;
  }

  protected _newsArticleStatusPolicy: OrUndefined<NewsArticleStatusPolicy>
  get newsArticleStatusPolicy(): NewsArticleStatusPolicy {
    if (this._newsArticleStatusPolicy) return this._newsArticleStatusPolicy;
    this._newsArticleStatusPolicy = new NewsArticleStatusPolicy(this._ctx);
    return this._newsArticleStatusPolicy;
  }

  protected _userPasswordService: OrUndefined<UserPasswordService>
  get userPasswordService(): UserPasswordService {
    if (this._userPasswordService) return this._userPasswordService;
    this._userPasswordService = new UserPasswordService(this._ctx);
    return this._userPasswordService;
  }

  protected _userPasswordRepository: OrUndefined<UserPasswordRepository>
  get userPasswordRepository(): UserPasswordRepository {
    if (this._userPasswordRepository) return this._userPasswordRepository;
    this._userPasswordRepository = new UserPasswordRepository(this._ctx);
    return this._userPasswordRepository;
  }

  protected _npmsDashboardItemPolicy: OrUndefined<NpmsDashboardItemPolicy>;
  get npmsDashboardItemPolicy(): NpmsDashboardItemPolicy {
    if (this._npmsDashboardItemPolicy) return this._npmsDashboardItemPolicy;
    this._npmsDashboardItemPolicy = new NpmsDashboardItemPolicy(this._ctx);
    return this._npmsDashboardItemPolicy;
  }

  protected _npmsDashboardItemRepository: OrUndefined<NpmsDashboardItemRepository>;
  get npmsDashboardItemRepository(): NpmsDashboardItemRepository {
    if (this._npmsDashboardItemRepository) return this._npmsDashboardItemRepository;
    this._npmsDashboardItemRepository = new NpmsDashboardItemRepository(this._ctx);
    return this._npmsDashboardItemRepository;
  }

  protected _npmsDashboardItemService: OrUndefined<NpmsDashboardItemService>;
  get npmsDashboardItemService(): NpmsDashboardItemService {
    if (this._npmsDashboardItemService) return this._npmsDashboardItemService;
    this._npmsDashboardItemService = new NpmsDashboardItemService(this._ctx);
    return this._npmsDashboardItemService;
  }

  protected _npmsDashboardPolicy: OrUndefined<NpmsDashboardPolicy>;
  get npmsDashboardPolicy(): NpmsDashboardPolicy {
    if (this._npmsDashboardPolicy) return this._npmsDashboardPolicy;
    this._npmsDashboardPolicy = new NpmsDashboardPolicy(this._ctx);
    return this._npmsDashboardPolicy;
  }

  protected _npmsDashboardRepository: OrUndefined<NpmsDashboardRepository>;
  get npmsDashboardRepository(): NpmsDashboardRepository {
    if (this._npmsDashboardRepository) return this._npmsDashboardRepository;
    this._npmsDashboardRepository = new NpmsDashboardRepository(this._ctx);
    return this._npmsDashboardRepository;
  }

  protected _npmsDashboardService: OrUndefined<NpmsDashboardService>;
  get npmsDashboardService(): NpmsDashboardService {
    if (this._npmsDashboardService) return this._npmsDashboardService;
    this._npmsDashboardService = new NpmsDashboardService(this._ctx);
    return this._npmsDashboardService;
  }

  protected _npmsDashboardStatusService: OrUndefined<NpmsDashboardStatusService>
  get npmsDashboardStatusService(): NpmsDashboardStatusService {
    if (this._npmsDashboardStatusService) return this._npmsDashboardStatusService;
    this._npmsDashboardStatusService = new NpmsDashboardStatusService(this._ctx);
    return this._npmsDashboardStatusService;
  }

  protected _npmsDashboardStatusRepository: OrUndefined<NpmsDashboardStatusRepository>
  get npmsDashboardStatusRepository(): NpmsDashboardStatusRepository {
    if (this._npmsDashboardStatusRepository) return this._npmsDashboardStatusRepository;
    this._npmsDashboardStatusRepository = new NpmsDashboardStatusRepository(this._ctx);
    return this._npmsDashboardStatusRepository;
  }

  protected _npmsDashboardStatusPolicy: OrUndefined<NpmsDashboardStatusPolicy>
  get npmsDashboardStatusPolicy(): NpmsDashboardStatusPolicy {
    if (this._npmsDashboardStatusPolicy) return this._npmsDashboardStatusPolicy;
    this._npmsDashboardStatusPolicy = new NpmsDashboardStatusPolicy(this._ctx);
    return this._npmsDashboardStatusPolicy;
  }

  protected _jwtService: OrUndefined<JwtService>
  get jwtService(): JwtService {
    if (this._jwtService) return this._jwtService;
    this._jwtService = new JwtService(this._ctx);
    return this._jwtService;
  }

  protected _authService: OrUndefined<AuthSerivce>
  get authService(): AuthSerivce {
    if (this._authService) return this._authService;
    this._authService = new AuthSerivce(this._ctx);
    return this._authService;
  }
}