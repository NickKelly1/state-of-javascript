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
import { NpmsDashboardStatusPolicy } from "../../app/npms-dashboard-status/npms-dashboard-status.policy";
import { NpmsDashboardStatusRepository } from "../../app/npms-dashboard-status/npms-dashboard-status.repository";
import { NpmsDashboardStatusService } from "../../app/npms-dashboard-status/npms-dashboard-status.service";
import { EmailService } from "../../app/email/email.service";
import { IntegrationService } from "../../app/integration/integration.service";
import { IntegrationRepository } from "../../app/integration/integration.repository";
import { IntegrationPolicy } from "../../app/integration/integration.policy";
import { GoogleService } from "../../app/google/google.service";
import { GooglePolicy } from "../../app/google/google.policy";
import { UserLinkTypePolicy } from "../../app/user-token-type/user-token-type.policy";
import { UserTokenTypeRepository } from "../../app/user-token-type/user-token-type.repository";
import { UserTokenTypeService } from "../../app/user-token-type/user-token-type.service";
import { UserTokenRepository } from "../../app/user-token/user-token.repository";
import { UserTokenService } from "../../app/user-token/user-token.service";
import { UserTokenPolicy } from "../../app/user-token/user-token.policy";
import { JobPolicy } from "../../app/job/job.policy";
import { LogPolicy } from "../../app/log/log.policy";
import { PermissionCategoryPolicy } from "../../app/permission-category/permission-category.policy";
import { PermissionCategoryRepository } from "../../app/permission-category/permission-category.repository";
import { PermissionCategoryService } from "../../app/permission-category/permission-category.service";
import { BlogPostService } from '../../app/blog-post/blog-post.service';
import { BlogPostRepository } from '../../app/blog-post/blog-post.repository';
import { BlogPostPolicy } from '../../app/blog-post/blog-post.policy';

import { BlogPostCommentService } from '../../app/blog-post-comment/blog-post-comment.service';
import { BlogPostCommentRepository } from '../../app/blog-post-comment/blog-post-comment.repository';
import { BlogPostCommentPolicy } from '../../app/blog-post-comment/blog-post-comment.policy';

import { BlogPostStatusService } from '../../app/blog-post-status/blog-post-status.service';
import { BlogPostStatusRepository } from '../../app/blog-post-status/blog-post-status.repository';
import { BlogPostStatusPolicy } from '../../app/blog-post-status/blog-post-status.policy';
import { AuthPolicy } from '../../app/user/auth.policy';
import { UserEmailPolicy } from '../../app/user/user-email.policy';
import { UserEmailService } from '../../app/user/user-email.service';

export interface IRequestServices {
  universal: IUniversalServices;

  userService: UserService;
  userEmailService: UserEmailService;
  userRepository: UserRepository;
  userPolicy: UserPolicy;
  authPolicy: AuthPolicy;
  userEmailPolicy: UserEmailPolicy;

  roleService: RoleService;
  roleRepository: RoleRepository;
  rolePolicy: RolePolicy;

  permissionCategoryService: PermissionCategoryService;
  permissionCategoryRepository: PermissionCategoryRepository;
  permissionCategoryPolicy: PermissionCategoryPolicy;

  permissionService: PermissionService;
  permissionRepository: PermissionRepository;
  permissionPolicy: PermissionPolicy;

  userRoleService: UserRoleService;
  userRoleRepository: UserRoleRepository;
  userRolePolicy: UserRolePolicy;

  rolePermissionService: RolePermissionService;
  rolePermissionRepository: RolePermissionRepository;
  rolePermissionPolicy: RolePermissionPolicy;

  blogPostService: BlogPostService;
  blogPostRepository: BlogPostRepository;
  blogPostPolicy: BlogPostPolicy;

  blogPostCommentService: BlogPostCommentService;
  blogPostCommentRepository: BlogPostCommentRepository;
  blogPostCommentPolicy: BlogPostCommentPolicy;

  blogPostStatusService: BlogPostStatusService;
  blogPostStatusRepository: BlogPostStatusRepository;
  blogPostStatusPolicy: BlogPostStatusPolicy;

  newsArticleService: NewsArticleService;
  newsArticleRepository: NewsArticleRepository;
  newsArticlePolicy: NewsArticlePolicy;

  newsArticleStatusService: NewsArticleStatusService;
  newsArticleStatusRepository: NewsArticleStatusRepository;
  newsArticleStatusPolicy: NewsArticleStatusPolicy;

  npmsDashboardStatusService: NpmsDashboardStatusService;
  npmsDashboardStatusRepository: NpmsDashboardStatusRepository;
  npmsDashboardStatusPolicy: NpmsDashboardStatusPolicy;

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

  integrationService: IntegrationService;
  integrationRepository: IntegrationRepository;
  integrationPolicy: IntegrationPolicy;

  userTokenService: UserTokenService;
  userTokenRepository: UserTokenRepository;
  userTokenPolicy: UserTokenPolicy;

  userTokenTypeService: UserTokenTypeService;
  userTokenTypeRepository: UserTokenTypeRepository;
  userTokenTypePolicy: UserLinkTypePolicy;

  googleService: GoogleService;
  googlePolicy: GooglePolicy;

  jobPolicy: JobPolicy;

  logPolicy: LogPolicy;

  jwtService: JwtService;
  authService: AuthSerivce;
  emailService: EmailService;
}
