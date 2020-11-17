import { Permission } from "../app/permission/permission.const";
import { Role } from "../app/role/role.const";
import { assertDefined } from "../common/helpers/assert-defined.helper";
import { ISeeder, ISeederArg } from "../common/seed/seeder.interface";

export default class implements ISeeder {
  tag = __filename;

  run = async (arg: ISeederArg): Promise<void> => {
    const { ctx, env, queryInterface, sequelize, transaction, } = arg;

    const publicPermissions = [
      Permission.SuperAdmin,

      Permission.ShowUsers,
      Permission.CreateUsers,
      Permission.UpdateUsers,
      Permission.SoftDeleteUsers,
      Permission.ManageUsers,

      Permission.ShowRoles,
      Permission.CreateRoles,
      Permission.UpdateRoles,
      Permission.SoftDeleteRoles,
      Permission.ManageRoles,

      Permission.ShowPermissions,

      Permission.ShowUserRoles,
      Permission.CreateUserRoles,
      Permission.UpdateUserRoles,
      Permission.HardDeleteUserRoles,
      Permission.ManageUserRoles,

      Permission.ShowRolePermissions,
      Permission.CreateRolePermissions,
      Permission.UpdateRolePermissions,
      Permission.HardDeleteRolePermissions,
      Permission.ManageRolePermissions,

      Permission.ShowNewsArticles,
      Permission.CreateNewsArticles,
      Permission.UpdateNewsArticles,
      Permission.SoftDeleteDeleteNewsArticles,
      Permission.ManageNewsArticles,

      Permission.ShowNewsArticleStatus,

      Permission.ShowNpmsPackages,
      Permission.CreateNpmsPackages,
      Permission.UpdateNpmsPackages,
      Permission.SoftDeleteNpmsPackages,
      Permission.ManageNpmsPackages,

      Permission.ShowNpmsDashboards,
      Permission.CreateNpmsDashboards,
      Permission.UpdateNpmsDashboards,
      Permission.SoftDeleteNpmsDashboards,
      Permission.ManageNpmsDashboards,

      Permission.ShowNpmsDashboardItem,
      Permission.CreateNpmsDashboardItem,
      Permission.UpdateNpmsDashboardItem,
      Permission.HardDeleteNpmsDashboardItem,
      Permission.ManageNpmsDashboardItem,
    ];

    // seed all public permissions
    await ctx.services.universal.db.useTransaction(transaction)(async ({ runner }) => {
      const role = await ctx.services.roleRepository.findByPkOrfail(Role.Public, { runner });
      const allPermissions = await ctx.services.permissionRepository.findAll({ runner });
      const allPermissionsMap = new Map(allPermissions.map(perm => [perm.id, perm]));
      for (const permissionId of publicPermissions) {
        const permission = assertDefined(allPermissionsMap.get(permissionId));
        await ctx.services.rolePermissionService.create({ runner, role, permission, });
      }
    });
  }
}