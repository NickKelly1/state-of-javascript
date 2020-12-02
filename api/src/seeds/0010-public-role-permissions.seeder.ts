import { Permission } from "../app/permission/permission.const";
import { Role } from "../app/role/role.const";
import { assertDefined } from "../common/helpers/assert-defined.helper";
import { ISeeder, ISeederArg } from "../common/seed/seeder.interface";

export default class implements ISeeder {
  tag = __filename;

  run = async (arg: ISeederArg): Promise<void> => {
    const { ctx, env, queryInterface, sequelize, transaction, } = arg;

    const publicPermissions = Object.values(Permission).flatMap(category => Object.values(category));

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