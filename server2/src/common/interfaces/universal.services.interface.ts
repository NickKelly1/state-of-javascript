import { Queue } from "bull";
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { HashService } from "../../app/hash/hash.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { PublicAuthorisation } from "../classes/public-authorisation";
import { EnvService } from "../environment/env";

export interface IUniversalServices {
  env: EnvService;
  sequelize: Sequelize;
  publicAuthorisation: PublicAuthorisation;
  npmsApi: NpmsApi;
  hash: HashService;
  db: DbService;
}