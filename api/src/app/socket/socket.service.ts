import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { IUniversalServices } from "../../common/interfaces/universal.services.interface";
import { logger } from "../../common/logger/logger";
import { ISocketMessage } from "./socket.message";

export class SocketService {
  //
  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    //
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}...`);
    this._initialised = true;
  }

  /**
   * De-initialise the service
   */
  public async deInit(): Promise<void> {
    if (!this._initialised) throw new InitialisationException();
    logger.info(`de-initialising ${this.constructor.name}...`);
    this._initialised = false;
  }

  /**
   * Send a socket message
   */
  broadcastAll(message: ISocketMessage): void {
    logger.info(`[${this.constructor.name}::broadcastAll] ${message.type}`);
    this.universal.io.send(JSON.stringify(message));
  }
}