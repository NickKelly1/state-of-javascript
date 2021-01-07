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
import { EmailService } from "../../app/email/email.service";
import { EmailPolicy } from "../../app/email/email.policy";
import { IntegrationRepository } from "../../app/integration/integration.repository";
import { IntegrationPolicy } from "../../app/integration/integration.policy";
import { IntegrationService } from "../../app/integration/integration.service";
import { GoogleService } from "../../app/google/google.service";
import { GooglePolicy } from "../../app/google/google.policy";
import { UserTokenPolicy } from "../../app/user-token/user-token.policy";
import { UserTokenRepository } from "../../app/user-token/user-token.repository";
import { UserTokenService } from "../../app/user-token/user-token.service";
import { UserLinkTypePolicy } from "../../app/user-token-type/user-token-type.policy";
import { UserTokenTypeRepository } from "../../app/user-token-type/user-token-type.repository";
import { UserTokenTypeService } from "../../app/user-token-type/user-token-type.service";
import { JobPolicy } from "../../app/job/job.policy";
import { LogPolicy } from "../../app/log/log.policy";
import { PermissionCategoryPolicy } from "../../app/permission-category/permission-category.policy";
import { PermissionCategoryRepository } from "../../app/permission-category/permission-category.repository";
import { PermissionCategoryService } from "../../app/permission-category/permission-category.service";
import { BlogPostCommentPolicy } from "../../app/blog-post-comment/blog-post-comment.policy";
import { BlogPostCommentRepository } from "../../app/blog-post-comment/blog-post-comment.repository";
import { BlogPostCommentService } from "../../app/blog-post-comment/blog-post-comment.service";
import { BlogPostStatusPolicy } from "../../app/blog-post-status/blog-post-status.policy";
import { BlogPostStatusRepository } from "../../app/blog-post-status/blog-post-status.repository";
import { BlogPostStatusService } from "../../app/blog-post-status/blog-post-status.service";
import { BlogPostPolicy } from "../../app/blog-post/blog-post.policy";
import { BlogPostRepository } from "../../app/blog-post/blog-post.repository";
import { BlogPostService } from "../../app/blog-post/blog-post.service";
import { BaseContext } from "../context/base.context";
import { AuthPolicy } from '../../app/user/auth.policy';
import { UserEmailPolicy } from '../../app/user/user-email.policy';
import { UserEmailService } from "../../app/user/user-email.service";
import { FileService } from "../../app/file/file.service";
import { FileRepository } from "../../app/file/file.repository";
import { ImageService } from "../../app/image/image.service";
import { ImageRepository } from "../../app/image/image.repository";
import { ImagePolicy } from "../../app/image/image.policy";
import { FilePolicy } from "../../app/file/file.policy";

export class RequestSerivceContainer implements IRequestServices {
  constructor(
    protected readonly _ctx: BaseContext,
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

  protected _userEmailService: OrUndefined<UserEmailService>;
  get userEmailService(): UserEmailService {
    if (this._userEmailService) return this._userEmailService;
    this._userEmailService = new UserEmailService(this._ctx);
    return this._userEmailService;
  }

  protected _userRepository: OrUndefined<UserRepository>;
  get userRepository(): UserRepository {
    if (this._userRepository) return this._userRepository;
    this._userRepository = new UserRepository(this._ctx);
    return this._userRepository;
  }

  protected _authPolicy: OrUndefined<AuthPolicy>;
  get authPolicy(): AuthPolicy {
    if (this._authPolicy) return this._authPolicy;
    this._authPolicy = new AuthPolicy(this._ctx);
    return this._authPolicy;
  }

  protected _userPolicy: OrUndefined<UserPolicy>;
  get userPolicy(): UserPolicy {
    if (this._userPolicy) return this._userPolicy;
    this._userPolicy = new UserPolicy(this._ctx);
    return this._userPolicy;
  }

  protected _userEmailPolicy: OrUndefined<UserEmailPolicy>;
  get userEmailPolicy(): UserEmailPolicy {
    if (this._userEmailPolicy) return this._userEmailPolicy;
    this._userEmailPolicy = new UserEmailPolicy(this._ctx);
    return this._userEmailPolicy;
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

  protected _permissionCategoryService: OrUndefined<PermissionCategoryService>
  get permissionCategoryService(): PermissionCategoryService {
    if (this._permissionCategoryService) return this._permissionCategoryService;
    this._permissionCategoryService = new PermissionCategoryService(this._ctx);
    return this._permissionCategoryService;
  }

  protected _permissionCategoryRepository: OrUndefined<PermissionCategoryRepository>
  get permissionCategoryRepository(): PermissionCategoryRepository {
    if (this._permissionCategoryRepository) return this._permissionCategoryRepository;
    this._permissionCategoryRepository = new PermissionCategoryRepository(this._ctx);
    return this._permissionCategoryRepository;
  }

  protected _permissionCategoryPolicy: OrUndefined<PermissionCategoryPolicy>
  get permissionCategoryPolicy(): PermissionCategoryPolicy {
    if (this._permissionCategoryPolicy) return this._permissionCategoryPolicy;
    this._permissionCategoryPolicy = new PermissionCategoryPolicy(this._ctx);
    return this._permissionCategoryPolicy;
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

  protected _blogPostService: OrUndefined<BlogPostService>
  get blogPostService(): BlogPostService {
    if (this._blogPostService) return this._blogPostService;
    this._blogPostService = new BlogPostService(this._ctx);
    return this._blogPostService;
  }

  protected _blogPostRepository: OrUndefined<BlogPostRepository>
  get blogPostRepository(): BlogPostRepository {
    if (this._blogPostRepository) return this._blogPostRepository;
    this._blogPostRepository = new BlogPostRepository(this._ctx);
    return this._blogPostRepository;
  }

  protected _blogPostPolicy: OrUndefined<BlogPostPolicy>
  get blogPostPolicy(): BlogPostPolicy {
    if (this._blogPostPolicy) return this._blogPostPolicy;
    this._blogPostPolicy = new BlogPostPolicy(this._ctx);
    return this._blogPostPolicy;
  }

  protected _blogPostCommentService: OrUndefined<BlogPostCommentService>
  get blogPostCommentService(): BlogPostCommentService {
    if (this._blogPostCommentService) return this._blogPostCommentService;
    this._blogPostCommentService = new BlogPostCommentService(this._ctx);
    return this._blogPostCommentService;
  }

  protected _blogPostCommentRepository: OrUndefined<BlogPostCommentRepository>
  get blogPostCommentRepository(): BlogPostCommentRepository {
    if (this._blogPostCommentRepository) return this._blogPostCommentRepository;
    this._blogPostCommentRepository = new BlogPostCommentRepository(this._ctx);
    return this._blogPostCommentRepository;
  }

  protected _blogPostCommentPolicy: OrUndefined<BlogPostCommentPolicy>
  get blogPostCommentPolicy(): BlogPostCommentPolicy {
    if (this._blogPostCommentPolicy) return this._blogPostCommentPolicy;
    this._blogPostCommentPolicy = new BlogPostCommentPolicy(this._ctx);
    return this._blogPostCommentPolicy;
  }

  protected _blogPostStatusService: OrUndefined<BlogPostStatusService>
  get blogPostStatusService(): BlogPostStatusService {
    if (this._blogPostStatusService) return this._blogPostStatusService;
    this._blogPostStatusService = new BlogPostStatusService(this._ctx);
    return this._blogPostStatusService;
  }

  protected _blogPostStatusRepository: OrUndefined<BlogPostStatusRepository>
  get blogPostStatusRepository(): BlogPostStatusRepository {
    if (this._blogPostStatusRepository) return this._blogPostStatusRepository;
    this._blogPostStatusRepository = new BlogPostStatusRepository(this._ctx);
    return this._blogPostStatusRepository;
  }

  protected _blogPostStatusPolicy: OrUndefined<BlogPostStatusPolicy>
  get blogPostStatusPolicy(): BlogPostStatusPolicy {
    if (this._blogPostStatusPolicy) return this._blogPostStatusPolicy;
    this._blogPostStatusPolicy = new BlogPostStatusPolicy(this._ctx);
    return this._blogPostStatusPolicy;
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

  protected _integrationService: OrUndefined<IntegrationService>
  get integrationService(): IntegrationService {
    if (this._integrationService) return this._integrationService;
    this._integrationService = new IntegrationService(this._ctx);
    return this._integrationService;
  }

  protected _integrationRepository: OrUndefined<IntegrationRepository>
  get integrationRepository(): IntegrationRepository {
    if (this._integrationRepository) return this._integrationRepository;
    this._integrationRepository = new IntegrationRepository(this._ctx);
    return this._integrationRepository;
  }

  protected _integrationPolicy: OrUndefined<IntegrationPolicy>
  get integrationPolicy(): IntegrationPolicy {
    if (this._integrationPolicy) return this._integrationPolicy;
    this._integrationPolicy = new IntegrationPolicy(this._ctx);
    return this._integrationPolicy;
  }

  protected _userTokenService: OrUndefined<UserTokenService>
  get userTokenService(): UserTokenService {
    if (this._userTokenService) return this._userTokenService;
    this._userTokenService = new UserTokenService(this._ctx);
    return this._userTokenService;
  }

  protected _userTokenRepository: OrUndefined<UserTokenRepository>
  get userTokenRepository(): UserTokenRepository {
    if (this._userTokenRepository) return this._userTokenRepository;
    this._userTokenRepository = new UserTokenRepository(this._ctx);
    return this._userTokenRepository;
  }

  protected _userTokenPolicy: OrUndefined<UserTokenPolicy>
  get userTokenPolicy(): UserTokenPolicy {
    if (this._userTokenPolicy) return this._userTokenPolicy;
    this._userTokenPolicy = new UserTokenPolicy(this._ctx);
    return this._userTokenPolicy;
  }

  protected _userTokenTypeService: OrUndefined<UserTokenTypeService>
  get userTokenTypeService(): UserTokenTypeService {
    if (this._userTokenTypeService) return this._userTokenTypeService;
    this._userTokenTypeService = new UserTokenTypeService(this._ctx);
    return this._userTokenTypeService;
  }

  protected _userTokenTypeRepository: OrUndefined<UserTokenTypeRepository>
  get userTokenTypeRepository(): UserTokenTypeRepository {
    if (this._userTokenTypeRepository) return this._userTokenTypeRepository;
    this._userTokenTypeRepository = new UserTokenTypeRepository(this._ctx);
    return this._userTokenTypeRepository;
  }

  protected _userTokenTypePolicy: OrUndefined<UserLinkTypePolicy>
  get userTokenTypePolicy(): UserLinkTypePolicy {
    if (this._userTokenTypePolicy) return this._userTokenTypePolicy;
    this._userTokenTypePolicy = new UserLinkTypePolicy(this._ctx);
    return this._userTokenTypePolicy;
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

  protected _fileService: OrUndefined<FileService>
  get fileService(): FileService {
    if (this._fileService) return this._fileService;
    this._fileService = new FileService(this._ctx);
    return this._fileService;
  }

  protected _fileRepository: OrUndefined<FileRepository>
  get fileRepository(): FileRepository {
    if (this._fileRepository) return this._fileRepository;
    this._fileRepository = new FileRepository(this._ctx);
    return this._fileRepository;
  }

  protected _filePolicy: OrUndefined<FilePolicy>
  get filePolicy(): FilePolicy {
    if (this._filePolicy) return this._filePolicy;
    this._filePolicy = new FilePolicy(this._ctx);
    return this._filePolicy;
  }

  protected _imageService: OrUndefined<ImageService>
  get imageService(): ImageService {
    if (this._imageService) return this._imageService;
    this._imageService = new ImageService(this._ctx);
    return this._imageService;
  }

  protected _imageRepository: OrUndefined<ImageRepository>
  get imageRepository(): ImageRepository {
    if (this._imageRepository) return this._imageRepository;
    this._imageRepository = new ImageRepository(this._ctx);
    return this._imageRepository;
  }

  protected _imagePolicy: OrUndefined<ImagePolicy>
  get imagePolicy(): ImagePolicy {
    if (this._imagePolicy) return this._imagePolicy;
    this._imagePolicy = new ImagePolicy(this._ctx);
    return this._imagePolicy;
  }

  protected _googleService: OrUndefined<GoogleService>
  get googleService(): GoogleService {
    if (this._googleService) return this._googleService;
    this._googleService = new GoogleService(this._ctx);
    return this._googleService;
  }

  protected _googlePolicy: OrUndefined<GooglePolicy>
  get googlePolicy(): GooglePolicy {
    if (this._googlePolicy) return this._googlePolicy;
    this._googlePolicy = new GooglePolicy(this._ctx);
    return this._googlePolicy;
  }

  protected _jobPolicy: OrUndefined<JobPolicy>
  get jobPolicy(): JobPolicy {
    if (this._jobPolicy) return this._jobPolicy;
    this._jobPolicy = new JobPolicy(this._ctx);
    return this._jobPolicy;
  }

  protected _logPolicy: OrUndefined<LogPolicy>
  get logPolicy(): LogPolicy {
    if (this._logPolicy) return this._logPolicy;
    this._logPolicy = new LogPolicy(this._ctx);
    return this._logPolicy;
  }

  protected _emailService: OrUndefined<EmailService>
  get emailService(): EmailService {
    if (this._emailService) return this._emailService;
    this._emailService = new EmailService(this._ctx);
    return this._emailService;
  }

  protected _emailPolicy: OrUndefined<EmailPolicy>
  get emailPolicy(): EmailPolicy {
    if (this._emailPolicy) return this._emailPolicy;
    this._emailPolicy = new EmailPolicy(this._ctx);
    return this._emailPolicy;
  }
}
