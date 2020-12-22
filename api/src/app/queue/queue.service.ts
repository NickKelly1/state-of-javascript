// interface ICreateQueue
import Bull from "bull";
import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { IUniversalServices } from '../../common/interfaces/universal.services.interface';
import { logger } from "../../common/logger/logger";
import { IEmailjob } from "../google/email.job.interface";

export interface IQueueServiceCreateQueueArg {
  name: string;
  prefix: string;
  attempts?: number;
  delay?: number;
  backoffDelay?: number
}

export class QueueService {
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
   * Create a queue
   */
  protected create<T>(arg: IQueueServiceCreateQueueArg): Bull.Queue<T> {
    const {
      name,
      prefix,
      delay,
      backoffDelay,
      attempts,
    } = arg;

    const queue = new Bull<T>(name, {
      defaultJobOptions: {
        attempts: attempts,
        backoff: backoffDelay ? { type: 'fixed', delay: backoffDelay, } : undefined,
        delay: delay,
      },
      prefix: prefix,
      redis: {
        password: this.universal.env.REDIS_PSW,
        host: this.universal.env.REDIS_HOST,
        port: this.universal.env.REDIS_PORT,
      },
    });

    return queue;
  }


  /**
   * Email Queue
   */
  protected _email?: Bull.Queue<IEmailjob>;
  get email(): Bull.Queue<IEmailjob> {
    if (this._email) return this._email;
    const queue = this.create<IEmailjob>({
      name: 'gmail',
      prefix: 'fixed',
      // 30 sec
      backoffDelay: 30_000,
      attempts: 2,
      delay: 5_000,
    });
    this._email = queue;
    return queue;
  }
}