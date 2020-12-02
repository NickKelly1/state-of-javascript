import Bull, { Queue } from "bull";
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { IGmailJob } from "../../app/google/gmail.job.interface";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { SystemPermissions } from "../classes/system-permissions";
import { EnvService } from "../environment/env";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { OrNull } from "../types/or-null.type";

export class UniversalSerivceContainer implements IUniversalServices {
  constructor(
    public readonly env: EnvService,
    public readonly sequelize: Sequelize,
    public readonly systemPermissions: SystemPermissions,
    public readonly npmsApi: NpmsApi,
    public readonly db: DbService,
  ) {
    //
  }


  /**
   * Encryption Service
   */
  protected _encryption?: EncryptionService;
  get encryption(): EncryptionService {
    if (this._encryption) return this._encryption;
    this._encryption = new EncryptionService(this);
    return this._encryption;
  }


  /**
   * Gmail Queue
   */
  protected _gmailQueue?: Bull.Queue<IGmailJob>;
  get gmailQueue(): Bull.Queue<IGmailJob> {
    if (this._gmailQueue) return this._gmailQueue;
    const queue = new Bull<IGmailJob>('gmail', {
      defaultJobOptions: {
        attempts: 2,
        // 30 sec backoff
        backoff: { type: 'fixed', delay: 30_000, },
        // 5 sec delay
        delay: 5_000,
      },
      prefix: '_gmail',
      redis: {
        password: this.env.REDIS_PSW,
        host: this.env.REDIS_HOST,
        port: this.env.REDIS_PORT,
      },
    });

    this._gmailQueue = queue;
    return queue;
  }
}
