import { Sequelize } from "sequelize";
import { createSequelize } from "../../app/db/create-sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { NpmsApiConnector } from "../../app/npms-package/api/npms-api-connector";
import { PublicAuthorisation } from "../classes/public-authorisation";
import { EnvService } from "../environment/env";
import { UniversalSerivceContainer } from "./universal.service.container";

export function universalServiceContainerFactory(arg: {
  env: EnvService;
  sequelize: Sequelize;
}): UniversalSerivceContainer {
  const { env, sequelize, } = arg;

  const universal = new UniversalSerivceContainer(
    env,
    sequelize,
    new PublicAuthorisation(env, sequelize),
    new NpmsApi(env, new NpmsApiConnector(env)),
    new DbService(sequelize),
  );

  return universal;
}