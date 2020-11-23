import { Queue } from "bull";
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { PublicAuthorisation } from "../classes/public-authorisation";
import { EnvService } from "../environment/env";
import { IUniversalServices } from "../interfaces/universal.services.interface";

export class UniversalSerivceContainer implements IUniversalServices {
  constructor(
    public readonly env: EnvService,
    public readonly sequelize: Sequelize,
    public readonly publicAuthorisation: PublicAuthorisation,
    public readonly npmsApi: NpmsApi,
    public readonly db: DbService,
  ) {
    //
  }

  protected _encryption?: EncryptionService;
  get encryption(): EncryptionService {
    if (this._encryption) return this._encryption;
    this._encryption = new EncryptionService(this);
    return this._encryption;
  }
}