import express, { Express } from 'express';
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { SystemPermissionsService } from "../classes/system-permissions.service";
import { EnvService } from "../environment/env";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { QueueService } from '../../app/queue/queue.service';
import { RedisService } from '../../app/db/redis.service';
import { NpmsApiConnector } from '../../app/npms-package/api/npms-api-connector';
import { InitialisationException } from '../exceptions/types/initialisation-exception';
import { SocketGateway } from '../../app/socket/socket.gateway';
import { SocketService } from '../../app/socket/socket.service';
import SocketIO from 'socket.io';

export class UniversalSerivceContainer implements IUniversalServices {
  /**
   * Encryption Service
   */
  public readonly encryptionService: EncryptionService;


  /**
   * Queue Service
   */
  public readonly queueService: QueueService;


  /**
   * Redis Service
   */
  public readonly redisService: RedisService;

  /**
   * System Permissions Service
   */
  public readonly systemPermissionsService: SystemPermissionsService;

  /**
   * Npms Api Service
   */
  public readonly npmsApi: NpmsApi;

  /**
   * The Express App
   */
  public readonly app: Express;

  /**
   * Socket Server
   */
  public readonly io: SocketIO.Server;

  /**
   * Db Service
   */
  public readonly db: DbService;

  /**
   * Socket Service
   */
  public readonly socketService: SocketService;

  /**
   * Socket Gateway
   */
  public readonly socketGateway: SocketGateway;

  constructor(
    public readonly env: EnvService,
    public readonly sequelize: Sequelize,
  ) {
    this.app = express();
    this.io = new SocketIO.Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.db = new DbService(this),
    this.encryptionService = new EncryptionService(this);
    this.redisService = new RedisService(this);
    this.queueService = new QueueService(this);
    this.npmsApi = new NpmsApi(this, new NpmsApiConnector(env)),
    this.systemPermissionsService = new SystemPermissionsService(this);
    this.socketService = new SocketService(this);
    this.socketGateway = new SocketGateway(this);
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    this._initialised = true;
    await this.db.init();
    await this.encryptionService.init();
    await this.redisService.init();
    await this.queueService.init();
    await this.npmsApi.init();
    await this.systemPermissionsService.init();
    await this.socketService.init();
    await this.socketGateway.init();
  }
}
