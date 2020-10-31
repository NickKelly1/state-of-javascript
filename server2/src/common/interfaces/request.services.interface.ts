import { JwtService } from "../../app/auth/jwt.service";
import { PermissionPolicy } from "../../app/permission/permission.policy";
import { PermissionRepository } from "../../app/permission/permission.repository";
import { PermissionService } from "../../app/permission/permission.service";
import { RolePermissionPolicy } from "../../app/role-permission/role-permission.policy";
import { RolePermissionRepository } from "../../app/role-permission/role-permission.repository";
import { RolePermissionService } from "../../app/role-permission/role-permission.service";
import { RoleRepository } from "../../app/role/role.repository";
import { RoleService } from "../../app/role/role.service";
import { RolePolicy } from "../../app/role/role.policy";
import { UserPasswordRepository } from "../../app/user-password/user-password.repository";
import { UserPasswordService } from "../../app/user-password/user-password.service";
import { UserRolePolicy } from "../../app/user-role/user-role.policy";
import { UserRoleRepository } from "../../app/user-role/user-role.repository";
import { UserRoleService } from "../../app/user-role/user-role.service";
import { UserPolicy } from "../../app/user/user.policy";
import { UserRepository } from "../../app/user/user.repository";
import { UserService } from "../../app/user/user.service";
import { NewsArticleService } from "../../app/news-article/news-article.service";
import { NewsArticleRepository } from "../../app/news-article/news-article.repository";
import { NewsArticlePolicy } from "../../app/news-article/news-article.policy";
import { AuthSerivce } from "../../app/auth/auth.service";
import { NewsArticleStatusService } from "../../app/news-article-status/news-article-status.service";
import { NewsArticleStatusRepository } from "../../app/news-article-status/news-article-status.repository";
import { NewsArticleStatusPolicy } from "../../app/news-article-status/news-article-status.policy";
import { IUniversalServices } from "./universal.services.interface";
import { NpmsPackageRepository } from "../../app/npms-package/npms-package.repository";
import { NpmsPackagePolicy } from "../../app/npms-package/npms-package.policy";
import { NpmsPackageService } from "../../app/npms-package/npms-package.service";
import { NpmsDashboardService } from "../../app/npms-dashboard/npms-dashboard.service";
import { NpmsDashboardRepository } from "../../app/npms-dashboard/npms-dashboard.repository";
import { NpmsDashboardPolicy } from "../../app/npms-dashboard/npms-dashboard.policy";
import { NpmsDashboardItemService } from "../../app/npms-dashboard-item/npms-dashboard-item.service";
import { NpmsDashboardItemPolicy } from "../../app/npms-dashboard-item/npms-dashboard-item.policy";
import { NpmsDashboardItemRepository } from "../../app/npms-dashboard-item/npms-dashboard-item.repository";

export interface IRequestServices {
  universal: IUniversalServices;

  userService: UserService;
  userRepository: UserRepository;
  userPolicy: UserPolicy;

  roleService: RoleService;
  roleRepository: RoleRepository;
  rolePolicy: RolePolicy;

  permissionService: PermissionService;
  permissionRepository: PermissionRepository;
  permissionPolicy: PermissionPolicy;

  userRoleService: UserRoleService;
  userRoleRepository: UserRoleRepository;
  userRolePolicy: UserRolePolicy;

  rolePermissionService: RolePermissionService;
  rolePermissionRepository: RolePermissionRepository;
  rolePermissionPolicy: RolePermissionPolicy;

  newsArticleService: NewsArticleService;
  newsArticleRepository: NewsArticleRepository;
  newsArticlePolicy: NewsArticlePolicy;

  newsArticleStatusService: NewsArticleStatusService;
  newsArticleStatusRepository: NewsArticleStatusRepository;
  newsArticleStatusPolicy: NewsArticleStatusPolicy;

  userPasswordService: UserPasswordService,
  userPasswordRepository: UserPasswordRepository;

  npmsPackageService: NpmsPackageService;
  npmsPackageRepository: NpmsPackageRepository;
  npmsPackagePolicy: NpmsPackagePolicy;

  npmsDashboardService: NpmsDashboardService;
  npmsDashboardRepository: NpmsDashboardRepository;
  npmsDashboardPolicy: NpmsDashboardPolicy;

  npmsDashboardItemService: NpmsDashboardItemService;
  npmsDashboardItemRepository: NpmsDashboardItemRepository;
  npmsDashboardItemPolicy: NpmsDashboardItemPolicy;

  jwtService: JwtService;
  authService: AuthSerivce;
}