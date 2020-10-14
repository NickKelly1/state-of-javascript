import { Sequelize, Op } from "sequelize";
import { UserRoleModel } from "../../circle";
import { EnvService } from "../../common/environment/env";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { orFail } from "../../common/helpers/or-fail.helper";
import { logger } from "../../common/logger/logger";
import { QueryRunner } from "../db/query-runner";
import { PermissionModel } from "../permission/permission.model";
import { RoleAssociation } from "../role/role.associations";
import { Role } from "../role/role.const";
import { RoleModel } from "../role/role.model";
import { UserAssociation } from "../user/user.associations";
import { UserField } from "../user/user.attributes";
import { User } from "../user/user.const";
import { UserModel } from "../user/user.model";
import { UserRoleAssociation } from "./user-role.associations";


export async function userRolesInitialise(arg: {
  runner: QueryRunner;
  env: EnvService;
}) {
  const { runner, env } = arg;
  const { transaction } = runner;

  // expect the admin role to have every permission...
  const [adminUser, adminRole] = await Promise.all([
    UserModel
      .findByPk(User.Admin, {
        transaction,
        include: { association: UserAssociation.userRoles, },
      })
      .then(orFail(() => new Error('Failed asserting admin user exists'))),
    RoleModel
      .findByPk(Role.Admin, { transaction })
      .then(orFail(() => new Error('Failed asserting admin role exists'))),
  ]);
  const actualUserRoles = assertDefined(adminUser?.userRoles);
  const actualRoles = actualUserRoles.map(ur => ur.role_id);
  const actualRolesSet = new Set(actualRoles);

  if (!actualRolesSet.has(adminRole.id)) {
    logger.warn(`Adding missing admin role to admin user`);
    const baby = UserRoleModel.build({ role_id: adminRole.id, user_id: adminUser.id });
    await baby.save({ transaction });
  }
}