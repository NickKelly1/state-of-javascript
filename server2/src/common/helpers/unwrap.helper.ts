import * as E from 'fp-ts/Either';
import { prettyQ } from './pretty.helper';

export interface IUnwrap {
  left: <L>(arg: E.Either<L, any>) => L;
  right: <R>(arg: E.Either<any, R>) => R;
}

export const unwrap: IUnwrap = {
  left: <L>(arg: E.Either<L, any>) => {
    if (E.isLeft(arg)) return arg.left;
    throw new Error(prettyQ(arg.right));
  },
  right: <R>(arg: E.Either<any, R>) => {
    if (E.isRight(arg)) return arg.right;
    throw new Error(prettyQ(arg.left));
  },
};