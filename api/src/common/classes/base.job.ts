import Bull from 'bull';
import { IUniversalServices } from '../interfaces/universal.services.interface';
import { OrNull } from '../types/or-null.type';
import { JobContext } from '../context/job.context';
import { logger } from '../logger/logger';
import { prettyQ } from '../helpers/pretty.helper';
import { nanoid } from 'nanoid';
import { InitialisationException } from '../exceptions/types/initialisation-exception';

export interface IBaseJobOptions {
  name: string;
  prefix: string;
  attempts?: number;
  delay?: number;
  backoffDelay?: number
}

export interface IJobProcessArg<T> { ctx: JobContext; job: Bull.Job<T>; id: string; }


/**
 * Base Job
 */
export abstract class BaseJob<T> {
  protected abstract options: IBaseJobOptions;

  /**
   * Process the job
   *
   * To be extened by subclass
   */
  protected abstract process(arg: IJobProcessArg<T>): Promise<void>;

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
    // ensure the queue exists...
    this.queue;
    this._initialised = true;
  }


  /**
   * The queue instance
   */
  protected _queue: OrNull<Bull.Queue<T>> = null;
  public get queue(): Bull.Queue<T> {
    if (this._queue) return this,this._queue;
    const {
      name,
      prefix,
      delay,
      backoffDelay,
      attempts,
    } = this.options;
    this._queue = new Bull<T>(name, {
      defaultJobOptions: {
        attempts: attempts,
        backoff: backoffDelay ? { type: 'fixed', delay: backoffDelay, } : undefined,
        delay: delay,
      },
      prefix: prefix,
      redis: {
        password: this.universal.env.REDIS_PASSWORD,
        host: this.universal.env.REDIS_HOST,
        port: this.universal.env.REDIS_PORT,
      },
    });

    logger.info(`[${this.constructor.name}::${this.options.name}] Creating job queue...`);
    this._queue.process(async (job) => {
      const id = nanoid();
      logger.info(`[Job::${this.options.name}::${id}] Starting...`);
      try {
        const ctx = new JobContext(this.universal);
        const arg: IJobProcessArg<T> = { ctx, job, id, };
        const result = await this.process(arg);
        logger.info(`[Job::${this.options.name}::${id}] Finished`);
        return result;
      } catch (error) {
        logger.error(`[Job::${this.options.name}::${id}] Errored: ${prettyQ({ data: job.data, error })}`);
        throw error;
      }
    });

    return this._queue;
  }

  /**
   * Runs after Enqueue
   */
  protected onBeforeEnqueue(): void | Promise<void> {
    logger.info(`[${this.constructor.name}::${this.options.name}] Enqueueing...`);
  }

  /**
   * Runs before Enqueue
   */
  protected onAfterEnqueue(): void | Promise<void> {
    logger.info(`[${this.constructor.name}::${this.options.name}] Finished Enqueueing`);
  }


  /**
   * Enqueue the Job
   */
  async enqueue(arg: T): Promise<void> {
    const { queue } = this;
    await this.onBeforeEnqueue();
    await queue.add(arg);
    await this.onAfterEnqueue();
    return;
  }
}