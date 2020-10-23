import { PublicEnv } from "../env/public-env.helper";
import { Api } from "./api";
import { ApiConnector } from "./api.connector";
import { ApiCredentials } from "./api.credentials";
import { IApiServices } from "./api.services.interface";
import { ApiAuthService } from "./services/auth/api.auth-service";
import { ApiPermissionService } from "./services/permission/api.permission.service";
import { ApiRolePermissionService } from "./services/role-permission/api.role-permission.service";
import { ApiRoleService } from "./services/role/api.role.service";
import { ApiUserRoleService } from "./services/user-roles/api.user-role.service";
import { ApiUserService } from "./services/user/api.user.service";

export function ApiFactory(arg: { publicEnv: PublicEnv }): Api {
  const { publicEnv } = arg;
  const credentials = new ApiCredentials(publicEnv);
  const apiConnector = new ApiConnector(publicEnv, credentials);
  const services: IApiServices = {
    users: new ApiUserService(apiConnector),
    auth: new ApiAuthService(apiConnector),
    permissions: new ApiPermissionService(apiConnector),
    rolePermissions: new ApiRolePermissionService(apiConnector),
    roles: new ApiRoleService(apiConnector),
    userRoles: new ApiUserRoleService(apiConnector),
  };
  const api = new Api(publicEnv, apiConnector, services, credentials);
  return api;
}