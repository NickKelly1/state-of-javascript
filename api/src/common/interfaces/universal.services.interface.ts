import { Express } from 'express';
import SocketIO from 'socket.io';
import { Sequelize } from "sequelize";
import { DbService } from "../../app/db/db.service";
import { EncryptionService } from "../../app/encryption/encryption.service";
import { NpmsApi } from "../../app/npms-package/api/npms-api";
import { SystemPermissionsService } from "../classes/system-permissions.service";
import { EnvService } from "../environment/env";
import { QueueService } from '../../app/queue/queue.service';
import { RedisService } from "../../app/db/redis.service";
import { SocketGateway } from '../../app/socket/socket.gateway';
import { SocketService } from '../../app/socket/socket.service';

export interface IUniversalServices {
  env: EnvService;
  sequelize: Sequelize;
  systemPermissionsService: SystemPermissionsService;
  npmsApi: NpmsApi;
  encryptionService: EncryptionService;
  redisService: RedisService;
  queueService: QueueService;
  db: DbService;
  app: Express;
  io: SocketIO.Server;
  socketService: SocketService;
  socketGateway: SocketGateway;
}