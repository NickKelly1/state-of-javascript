import { EnvService } from "../../common/environment/env";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { logger } from "../../common/logger/logger";
import { QueryRunner } from "../db/query-runner";
import { RoleId } from "./role.id.type";
import { Role } from "./role.const";
import { RoleModel } from "./role.model";
import { RolePermissionModel } from "../role-permission/role-permission.model";


export async function rolesInitialise(arg: {
  runner: QueryRunner;
  env: EnvService;
}) {
  const { runner, env } = arg;
  const { transaction } = runner;

  const reverseMap: Record<number, string> = Object.fromEntries(Object.entries(Role).map(([k, v]): [number, string] => [v, k]));
  const expectedArr: RoleId[] = Object.values(Role);
  const getName = (id: RoleId) => assertDefined(reverseMap[id]);

  const allRoles = await RoleModel.findAll({ transaction });

  const allRolesMap = new Map(allRoles.map(perm => [perm.id, perm]));
  const expectedSet = new Set(expectedArr);

  const unexpected = allRoles.filter(perm => !expectedSet.has(perm.id));
  const missing = expectedArr.filter(perm => !allRolesMap.has(perm));
  const broken = allRoles.filter(perm => expectedSet.has(perm.id) && perm.name !== getName(perm.id));

  // remove unexpected
  if (unexpected.length) {
    logger.warn(`Removing "${unexpected.length}" unexpected roles...`);
    await Promise.all(unexpected.map(unex => unex.destroy({ transaction })));
  }

  // fix broken
  if (broken.length) {
    logger.warn(`Fixing "${unexpected.length}" broken roles...`);
    await Promise.all(broken.map(broke => {
      broke.name = getName(broke.id);
      return broke.save({ transaction });
    }))
  }

  // add missing
  if (missing.length) {
    logger.warn(`Adding "${missing.length}" missing roles...`);
    await Promise.all(missing.map(miss => {
      const baby = RoleModel.build({ id: miss, name: getName(miss) });
      return baby.save({ transaction });
    }));
  }
}