import { ApiAuthService } from "./services/auth/api.auth-service";
import { ApiPermissionService } from "./services/permission/api.permission.service";
import { ApiRolePermissionService } from "./services/role-permission/api.role-permission.service";
import { ApiRoleService } from "./services/role/api.role.service";
import { ApiUserRoleService } from "./services/user-roles/api.user-role.service";
import { ApiUserService } from "./services/user/api.user.service";

export interface IApiServices {
  readonly auth: ApiAuthService;
  readonly users: ApiUserService;
  readonly roles: ApiRoleService;
  readonly permissions: ApiPermissionService;
  readonly userRoles: ApiUserRoleService;
  readonly rolePermissions: ApiRolePermissionService;
}
