import Bull, { Queue } from "bull";
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { IGmailJob } from "../../app/google/gmail.job.interface";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { SystemPermissions } from "../classes/system-permissions";
import { EnvService } from "../environment/env";

export interface IUniversalServices {
  env: EnvService;
  sequelize: Sequelize;
  systemPermissions: SystemPermissions;
  npmsApi: NpmsApi;
  encryption: EncryptionService;
  db: DbService;
  gmailQueue: Bull.Queue<IGmailJob>;
}