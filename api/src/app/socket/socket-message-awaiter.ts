import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from '../../common/logger/logger';
import { ISocketMessage } from './socket.message';
import { IQueryAwaiter, IQueryAwaiterType, } from '../db/query-runner';

export class SocketMessageAwaiter implements IQueryAwaiter {
  public readonly type: IQueryAwaiterType;

  constructor(
    protected readonly message: ISocketMessage,
  ) {
    this.type = message.type;
  }

  /**
   * @inheritdoc
   */
  async handle(universal: IUniversalServices): Promise<void> {
    logger.info(`[${this.constructor.name}::handle]: Sending "${this.message.type}"`);
    universal.socketService.broadcastAll(this.message);
  }
} 