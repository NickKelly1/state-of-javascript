import IORedis from "ioredis";
import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { IUniversalServices } from "../../common/interfaces/universal.services.interface";
import { logger } from "../../common/logger/logger";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { RedisClient } from './redis.client';
import { RedisChannel } from './redis.channel.const';


/**
 * TODO: lift initialisation logic...
 */
export class RedisService {
  constructor(
    protected universal: IUniversalServices,
  ) {
    //
  }

  /**
   * Client
   */
  protected _client: OrUndefined<RedisClient>
  public get client(): RedisClient {
    if (!this._client) throw new InitialisationException();
    return this._client;
  }

  /**
   * Publisher
   */
  protected _publisher: OrUndefined<RedisClient>
  public get publisher(): RedisClient {
    if (!this._publisher) throw new InitialisationException();
    return this._publisher;
  }

  /**
   * Subscriber
   */
  protected _subscriber: OrUndefined<RedisClient>
  public get subscriber(): RedisClient {
    if (!this._subscriber) throw new InitialisationException();
    return this._subscriber;
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
   * Subscribe to a channel
   * 
   * Returns an unsubscribe function
   */
  subscribe(arg: {
    channel: string,
    message?: string,
    cb: (channel: string, message: string) => unknown,
  // eslint-disable-next-line @typescript-eslint/ban-types
  }): Function {
    const { channel: _channel, message: _message, cb, } = arg;
    const handleMessage = (channel: string, message: string) => {
      // matches target?
      if (channel === _channel && (_message == null || (message === _message))) {
        cb(channel, message);
      }
    };
    this.subscriber.on('message', handleMessage);
    return () => this.subscriber.off('message', handleMessage);
  }

  // unsubscribe

  /**
   * Spin up the service
   */
  protected async _up(): Promise<void> {
    const options: IORedis.RedisOptions = {
      password: this.universal.env.REDIS_PASSWORD,
      host: this.universal.env.REDIS_HOST,
      port: this.universal.env.REDIS_PORT,
    };
    this._client = new RedisClient(options, 'client');
    this._publisher = new RedisClient(options, 'publisher');
    this._subscriber = new RedisClient(options, 'subscriber');
    await this._client.init();
    await this._publisher.init();
    await this._subscriber.init();
    await this._subscriber.subscribe(RedisChannel.sys_permissions.name);
  }

  /**
   * Spin down the service
   */
  protected async _down(): Promise<void> {
    await this.client.deInit();
    await this.publisher.deInit();
    await this.subscriber.deInit();
  }
}