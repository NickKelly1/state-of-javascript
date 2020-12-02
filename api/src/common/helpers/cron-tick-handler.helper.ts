import { IUniversalServices } from '../interfaces/universal.services.interface';
import { nanoid } from 'nanoid';
import { CronContext } from '../context/cron.context';
import { CronCommand } from 'cron';
import { logger } from '../logger/logger';
import { prettyQ } from './pretty.helper';


export interface ICronTickHandlerFnArg { ctx: CronContext; }
export interface ICronTickHandlerFn { (arg: ICronTickHandlerFnArg): Promise<void>; }

export const CronTickHandlerFactory = (universal: IUniversalServices) => (fn: ICronTickHandlerFn): CronCommand => () => {
  const doTick = async () => {
    const id = nanoid();
    try {
      logger.info(`[Cron::${id}] Running...`);
      const ctx = new CronContext(universal);
      const arg: ICronTickHandlerFnArg = { ctx, };
      const result = await fn(arg);
      logger.info(`[Cron::${id}] Finished`);
      return;
    }
    catch (error) {
      logger.info(`[Cron::${id}] Errored: ${prettyQ(error)}`);
      throw error;
    }
  }
  doTick();
}