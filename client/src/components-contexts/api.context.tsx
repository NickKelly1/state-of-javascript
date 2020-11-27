import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { ApiMe } from '../backend-api/api.me';
import { ApiFactory, ApiFactoryArgType } from '../backend-api/api.factory';
import { OrNull } from '../types/or-null.type';
import { PublicEnvContext } from './public-env.context';
import { IApiMeSerialized } from '../types/api-me-serialized.hinterface';
import { WithLoadable } from '../components-hoc/with-loadable/with-loadable';
import { ApiException } from '../backend-api/api.exception';
import { attemptAsync, fail, isFail } from '../helpers/attempted.helper';
import { normaliseApiException } from '../backend-api/normalise-api-exception.helper';
import { IUnsubscribe } from '../helpers/ts-event';
import { DebugException } from '../components/debug-exception/debug-exception';
import { CircularProgress } from '@material-ui/core';

interface IApiContext {
  me: ApiMe,
  api: Api;
}

export const ApiContext = createContext<IApiContext>(null!);

interface IApiProviderProps {
  children: ReactNode;
  initialMe?: IApiMeSerialized;
}

export function ApiProvider(props: IApiProviderProps) {
  const { children, initialMe, } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ready, setReady] = useState(false);

  const [exception, setException] = useState<OrNull<ApiException>>(null);


  // lazy load api/me if not given by server...
  const [ctx, setCtx] = useState<OrNull<IApiContext>>(() => {
    if (!initialMe) return null;
    const me = ApiMe.deserialize(initialMe);
    const api = ApiFactory({
      publicEnv,
      type: ApiFactoryArgType.WithMe,
      me,
    });
    return { me, api, };
  });

  useEffect(() => {
    if (!ctx) {
      (async () => {
        const api = await attemptAsync(
          ApiFactory({
            publicEnv,
            type: ApiFactoryArgType.WithoutCredentials,
            me: undefined,
          }),
          normaliseApiException,
        );
        if (isFail(api)) { setException(api.value); }
        else { setCtx({ api: api.value, me: api.value.me, }); }
      })();
    }
  }, []);

  if (exception) {
    return <DebugException exception={exception} />
  }

  if (!ctx) {
    return <CircularProgress />
  }

  return (
    <ApiProviderContent incomingCtx={ctx}>
      {children}
    </ApiProviderContent>
  );
}

interface IApiProviderContentProps {
  children: ReactNode;
  incomingCtx: IApiContext;
}
export function ApiProviderContent(props: IApiProviderContentProps) {
  const { children, incomingCtx, } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ready, setReady] = useState(false);

  const [ctx, setCtx] = useState<IApiContext>(incomingCtx);

  useEffect(() => {
    const { api } = ctx;
    const unsubs: IUnsubscribe[] = [];
    unsubs.push(api.event.authenticated.on((me) => {
      setCtx((prev) => ({ ...prev, me, }));
    }));
    unsubs.push(api.event.unauthenticated.on((me) => {
      setCtx((prev) => ({ ...prev, me, }));
    }));
    () => { unsubs.forEach(unsub => unsub()); }
  }, []);

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  )
}
