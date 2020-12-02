import { IRouterHandler, NextFunction, Request, RequestHandler, Response, Handler } from 'express';
import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { HttpContext } from '../context/http.context';
import { RequestAuth } from '../classes/request-auth';
import { $TS_FIX_ME } from '../types/$ts-fix-me.type';
import { handler } from './handler.helper';
import { ist } from './ist.helper';
import { isu } from './isu.helper';
import Bull, { ProcessPromiseFunction } from 'bull';
import { JobContext } from '../context/job.context';
import { IUniversalServices } from '../interfaces/universal.services.interface';


export interface IJobFnArg<T> { ctx: JobContext; job: Bull.Job<T>; }
export interface IJobFn<T> { (arg: IJobFnArg<T>): Promise<void>; }

export const JobRunnerFactory = (universal: IUniversalServices) => <T>(fn: IJobFn<T>): ProcessPromiseFunction<T> => {
  const doJob: ProcessPromiseFunction<T> = async (job) => {
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