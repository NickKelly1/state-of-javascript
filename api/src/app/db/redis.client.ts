import IORedis  from "ioredis";
import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { logger } from "../../common/logger/logger";


export class RedisClient extends IORedis {
  constructor(
    options: IORedis.RedisOptions,
    public readonly name: string,
  ) {
    super(options);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleReady = this.handleReady.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleReconnecting = this.handleReconnecting.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}::${this.name}...`);
    this._initialised = true;
    await this._up();
  }

  /**
   * De-initialise the service
   */
  public async deInit(): Promise<void> {
    if (!this._initialised) throw new InitialisationException();
    logger.info(`de-initialising ${this.constructor.name}::${this.name}...`);
    this._initialised = false;
    await this._down();
  }

  /**
   * Spin up the service
   */
  protected async _up(): Promise<void> {
    this
      .on('connect', this.handleConnect)
      .on('ready', this.handleReady)
      .on('error', this.handleError)
      .on('close', this.handleClose)
      .on('reconnecting', this.handleReconnecting)
      .on('end', this.handleEnd)
      .on('message', this.handleMessage);
    // await this.connect();
  }

  /**
   * Spin down the service
   */
  protected async _down(): Promise<void> {
    this
      .off('connect', this.handleConnect)
      .off('ready', this.handleReady)
      .off('error', this.handleError)
      .off('close', this.handleClose)
      .off('reconnecting', this.handleReconnecting)
      .off('end', this.handleEnd)
      .off('message', this.handleMessage);
    // await this.disconnect();
  }


  protected handleConnect(): void {
    logger.info(`${this.constructor.name}::${this.name}::handleConnect`)
  }
  protected handleReady(): void {
    logger.info(`${this.constructor.name}::${this.name}::handleReady`)
  }
  protected handleError(error: unknown): void {
    logger.info(`[${this.constructor.name}::${this.name}::handleError] ${prettyQ(error)}`)
  }
  protected handleClose(): void {
    logger.info(`${this.constructor.name}::${this.name}::handleClose`)
  }
  protected handleReconnecting(): void {
    logger.info(`${this.constructor.name}::${this.name}::handleReconnecting`)
  }
  protected handleEnd(): void {
    logger.info(`${this.constructor.name}::${this.name}::handleEnd`)
  }
  protected handleMessage(channel: string, message: string): void {
    logger.info(`[${this.constructor.name}::${this.name}::handleMessage] channel: "${channel}", message: "${message}"`);
  }
}
