import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { ApiMe } from '../backend-api/api.me';
import { ApiFactory, ApiFactoryArgType } from '../backend-api/api.factory';
import { OrNull } from '../types/or-null.type';
import { PublicEnvContext } from './public-env.context';
import { IApiMeSerialized } from '../types/api-me-serialized.hinterface';

interface IApiContext {
  me: ApiMe,
  api: Api;
}

export const ApiContext = createContext<IApiContext>(null!);

interface IApiProviderProps {
  children: ReactNode;
  initialMe: IApiMeSerialized;
}

export function ApiProvider(props: IApiProviderProps) {
  const { children, initialMe, } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ready, setReady] = useState(false);

  // TODO: provide credentials...
  const [ctx, setCtx] = useState<IApiContext>(() => {
    const me = ApiMe.deserialize(initialMe);
    const api = ApiFactory({
      publicEnv,
      type: ApiFactoryArgType.WithMe,
      me,
    });
    return { me, api, };
  });

  useEffect(() => {
    const { api } = ctx;
    api.event.authenticated.on((me) => {
      setCtx((prev) => ({ ...prev, me, }));
    });
    api.event.unauthenticated.on((me) => {
      setCtx((prev) => ({ ...prev, me, }));
    });

    // // fire a refresh...
    // api.refresh();

    // don't let children render - they may need auth...
  }, []);


  // if (!ready) return null;

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  )
}
