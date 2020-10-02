import React, { ReactNode } from 'react';
import { Attempt, isFail } from '../../helpers/attempted.helper';

export interface IWithAttemptedProps<T, E> {
  attempted: Attempt<T, E>;
  children: (arg: T) => JSX.Element | string;
  fallback?: JSX.Element | string;
}

export function WithAttempted<T, E>(props: IWithAttemptedProps<T, E>): JSX.Element {
  const { attempted, children, fallback } = props;

  if (isFail(attempted)) {
    if (fallback) <>fallback</>;
    return <pre>{JSON.stringify({ TODO: 'default error...', error: attempted.value })}</pre>
  }

  return <>{children(attempted.value)}</>;
}