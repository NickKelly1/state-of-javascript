import { ExecutionContext } from './classes/execution-context';
import { HttpContext } from './classes/http.context';

declare module 'express' {
  export interface Request {
    context?: HttpContext;
  }
}