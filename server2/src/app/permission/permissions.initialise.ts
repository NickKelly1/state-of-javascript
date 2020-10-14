import { Sequelize } from "sequelize";
import { EnvService } from "../../common/environment/env";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { logger } from "../../common/logger/logger";
import { QueryRunner } from "../db/query-runner";
import { PermissionId } from "./permission-id.type";
import { Permission } from "./permission.const";
import { PermissionModel } from "./permission.model";


export async function permissionsInitialise(arg: {
  runner: QueryRunner;
  env: EnvService;
}) {
  const { runner, env } = arg;
  const { transaction } = runner;

  const reverseMap: Record<number, string> = Object.fromEntries(Object.entries(Permission).map(([k, v]): [number, string] => [v, k]));
  const expectedArr: PermissionId[] = Object.values(Permission);
  const getName = (id: PermissionId) => assertDefined(reverseMap[id]);

  const allPermissions = await PermissionModel.findAll({ transaction });

  const allPermissionsMap = new Map(allPermissions.map(perm => [perm.id, perm]));
  const expectedSet = new Set(expectedArr);

  const unexpected = allPermissions.filter(perm => !expectedSet.has(perm.id));
  const missing = expectedArr.filter(perm => !allPermissionsMap.has(perm));
  const broken = allPermissions.filter(perm => expectedSet.has(perm.id) && perm.name !== getName(perm.id));

  // remove unexpected
  if (unexpected.length) {
    logger.warn(`Removing "${unexpected.length}" unexpected permissions...`);
    await Promise.all(unexpected.map(unex => unex.destroy({ transaction })));
  }

  // fix broken
  if (broken.length) {
    logger.warn(`Fixing "${unexpected.length}" broken permissions...`);
    await Promise.all(broken.map(broke => {
      broke.name = getName(broke.id);
      return broke.save({ transaction });
    }))
  }

  // add missing
  if (missing.length) {
    logger.warn(`Adding "${missing.length}" missing permissions...`);
    await Promise.all(missing.map(miss => {
      const baby = PermissionModel.build({ id: miss, name: getName(miss) });
      return baby.save({ transaction });
    }));
  }
}