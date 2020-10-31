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

      Permission.ShowUser,
      Permission.CreateUser,
      Permission.UpdateUser,
      Permission.DeleteUser,
      Permission.ManageUser,

      Permission.ShowRole,
      Permission.CreateRole,
      Permission.UpdateRole,
      Permission.DeleteRole,
      Permission.ManageRole,

      Permission.ShowPermission,

      Permission.ShowUserRole,
      Permission.CreateUserRole,
      Permission.UpdateUserRole,
      Permission.DeleteUserRole,
      Permission.ManageUserRole,

      Permission.ShowRolePermission,
      Permission.CreateRolePermission,
      Permission.UpdateRolePermission,
      Permission.DeleteRolePermission,
      Permission.ManageRolePermission,

      Permission.ShowNewsArticle,
      Permission.CreateNewsArticle,
      Permission.UpdateNewsArticle,
      Permission.DeleteNewsArticle,
      Permission.ManageNewsArticle,

      Permission.ShowNewsArticleStatus,

      Permission.ShowNpmsRecord,
      Permission.CreateNpmsRecord,
      Permission.UpdateNpmsRecord,
      Permission.DeleteNpmsRecord,
      Permission.ManageNpmsRecords,

      Permission.ShowNpmsDashboard,
      Permission.CreateNpmsDashboard,
      Permission.UpdateNpmsDashboard,
      Permission.DeleteNpmsDashboard,
      Permission.ManageNpmsDashboard,

      Permission.ShowNpmsDashboardItem,
      Permission.CreateNpmsDashboardItem,
      Permission.UpdateNpmsDashboardItem,
      Permission.DeleteNpmsDashboardItem,
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