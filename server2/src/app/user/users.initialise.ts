import { EnvService } from "../../common/environment/env";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { logger } from "../../common/logger/logger";
import { QueryRunner } from "../db/query-runner";
import { UserId } from "./user.id.type";
import { User } from "./user.const";
import { UserModel } from "./user.model";


export async function usersInitialise(arg: {
  runner: QueryRunner;
  env: EnvService;
}) {
  const { runner, env } = arg;
  const { transaction } = runner;

  const reverseMap: Record<number, string> = Object.fromEntries(Object.entries(User).map(([k, v]): [number, string] => [v, k]));
  const expectedArr: UserId[] = Object.values(User);
  const getName = (id: UserId) => assertDefined(reverseMap[id]);

  const allUsers = await UserModel.findAll({ transaction });

  const allUsersMap = new Map(allUsers.map(perm => [perm.id, perm]));
  const expectedSet = new Set(expectedArr);

  const missing = expectedArr.filter(usr => !allUsersMap.has(usr));
  const broken = allUsers.filter(perm => expectedSet.has(perm.id) && perm.name !== getName(perm.id));

  // fix broken
  if (broken.length) {
    logger.warn(`Fixing "${broken.length}" broken users...`);
    await Promise.all(broken.map(broke => {
      broke.name = getName(broke.id);
      return broke.save({ transaction });
    }))
  }

  // add missing
  if (missing.length) {
    logger.warn(`Adding "${missing.length}" missing users...`);
    await Promise.all(missing.map(miss => {
      const baby = UserModel.build({ id: miss, name: getName(miss) });
      return baby.save({ transaction });
    }));
  }
}