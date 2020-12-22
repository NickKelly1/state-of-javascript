import { prettyQ } from '../../common/helpers/pretty.helper';
import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from '../../common/logger/logger';
import { IQueryAwaiter, } from './query-runner';

export class PubsubMessageAwaiter implements IQueryAwaiter {
  public readonly type: string;
  public readonly message: string;

  constructor(arg: {
    type: string,
    message?: string,
  }) {
    this.type = arg.type;
    this.message = arg.message ?? '';
  }
  //

  /**
   * @inheritdoc
   */
  async handle(universal: IUniversalServices): Promise<void> {
    logger.info(`[${this.constructor.name}::handle]: Publishing "${prettyQ({ channel: this.type, message: this.message, })}"`);
    await new Promise((res, rej) => universal.redisService.publisher.publish(
      this.type,
      this.message,
      (err) => err ? rej(err) : res(undefined),
    ));
  }
} 