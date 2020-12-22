import { InitialisationException } from '../../common/exceptions/types/initialisation-exception';
import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from '../../common/logger/logger';
import SocketIO from 'socket.io';
import { RedisChannel } from '../db/redis.channel.const';
import { invoke } from '../../common/helpers/invoke.helper';
import { SocketMessageType } from './socket.message';

export class SocketGateway {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected _unsubs: Function[] = [];

  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    this.handleConnection = this.handleConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}...`);
    this._initialised = true;
    await this._up();
  }

  /**
   * De-initialise the service
   */
  public async deInit(): Promise<void> {
    if (!this._initialised) throw new InitialisationException();
    logger.info(`de-initialising ${this.constructor.name}...`);
    this._initialised = false;
    await this._down();
  }

  /**
   * Spin up the service
   */
  protected async _up(): Promise<void> {
    this.universal.io.on('connection', this.handleConnection);
    this._unsubs.push(this.universal.redisService.subscribe({
      channel: RedisChannel.roles.name,
      message: RedisChannel.roles.messages.updated,
      cb: this.handleRolesUpdated,
    }));
  }

  /**
   * Spin down the service
   */
  protected async _down(): Promise<void> {
    this.universal.io.off('connection', this.handleConnection);
    this._unsubs.forEach(invoke);
  }

  /**
   * Fired when roles are updated
   */
  async handleRolesUpdated(): Promise<void> {
    logger.info(`${this.constructor.name}::handleRolesUpdated`);
    this.universal.socketService.broadcastAll({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    });
  }

  /**
   * Fired when a Socket connects
   */
  async handleConnection(socket: SocketIO.Socket): Promise<void> {
    logger.info(`${this.constructor.name}::handleConnection`);
    socket.on('message', (message: string) => this.handleMessage(socket, message));
    socket.on('disconnect', () => {
      socket.removeAllListeners();
    });
  }

  /**
   * Fired when a Socket sends a message
   */
  async handleMessage(socket: SocketIO.Socket, message: string): Promise<void> {
    console.log(`[${this.constructor.name}::handleMessage] handle message....`);
  }
}

