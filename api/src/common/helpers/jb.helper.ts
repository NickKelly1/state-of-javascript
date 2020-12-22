import Bull, { ProcessPromiseFunction } from 'bull';
import { JobContext } from '../context/job.context';
import { IUniversalServices } from '../interfaces/universal.services.interface';


export interface IJobFnArg<T> { ctx: JobContext; job: Bull.Job<T>; }
export interface IJobFn<T> { (arg: IJobFnArg<T>): Promise<void>; }

export const JobRunnerFactory = (universal: IUniversalServices) => <T>(fn: IJobFn<T>): ProcessPromiseFunction<T> => {
  const doJob: ProcessPromiseFunction<T> = async (job) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const ctx = new JobContext(universal);
      const arg: IJobFnArg<T> = { ctx, job, };
      const result = await fn(arg);
      return result;
    }
    catch (error) {
      throw error;
    }
  }
  return doJob;
}