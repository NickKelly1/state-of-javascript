import { Queue } from "bull";
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { PublicAuthorisation } from "../classes/public-authorisation";
import { EnvService } from "../environment/env";

export interface IUniversalServices {
  env: EnvService;
  sequelize: Sequelize;
  publicAuthorisation: PublicAuthorisation;
  npmsApi: NpmsApi;
  encryption: EncryptionService;
  db: DbService;
}