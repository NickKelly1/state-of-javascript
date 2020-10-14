import { Sequelize } from "sequelize";
import { RolePermissionModel } from "../../circle";
import { EnvService } from "../../common/environment/env";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { orFail } from "../../common/helpers/or-fail.helper";
import { logger } from "../../common/logger/logger";
import { QueryRunner } from "../db/query-runner";
import { PermissionModel } from "../permission/permission.model";
import { RoleAssociation } from "../role/role.associations";
import { Role } from "../role/role.const";
import { RoleModel } from "../role/role.model";
import { RolePermissionAssociation } from "./role-permission.associations";


export async function rolePermissionsInitialise(arg: {
  runner: QueryRunner;
  env: EnvService;
}) {
  const { runner, env } = arg;
  const { transaction } = runner;

  // expect the admin role to have every permission...
  const [adminRole, allPermissions] = await Promise.all([
    RoleModel
      .findByPk(Role.Admin, {
        transaction,
        include: { association: RoleAssociation.rolePermissions, },
      })
      .then(orFail(() => new Error('Failed asserting admin role exists'))),
    PermissionModel.findAll({ transaction }),
  ]);
  const actualRolesPermissions = assertDefined(adminRole?.rolePermissions);
  const actualPermissions = assertDefined(actualRolesPermissions.map(rp => rp.permission_id));
  const actualPermissionSet = new Set(actualPermissions);

  const allPermissionsMap = new Map(allPermissions.map(perm => [perm.id, perm]));
  const missingPermissions = allPermissions.filter(perm => !actualPermissionSet.has(perm.id));

  // is admins name broken?
  const expectedName = 'Admin';
  if (adminRole.name !== expectedName) {
    logger.warn(`Fixing broken admin name`);
    adminRole.name = expectedName;
    await adminRole.save({ transaction });
  }

  // add missing
  if (missingPermissions.length) {
    logger.warn(`Adding "${missingPermissions.length}" missing permissions from admin...`);
    await Promise.all(missingPermissions.map(miss => {
      const baby = RolePermissionModel.build({ role_id: adminRole.id, permission_id: miss.id });
      return baby.save({ transaction });
    }));
  }
}