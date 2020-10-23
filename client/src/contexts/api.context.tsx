import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { IMe } from '../backend-api/api.credentials';
import { ApiFactory } from '../backend-api/api.factory';
import { PermissionId } from '../backend-api/services/permission/permission.id';
import { OrNull } from '../types/or-null.type';
import { PublicEnvContext } from './public-env.context';

interface IApiContext {
  me: OrNull<IMe>,
  api: Api;
}

export const ApiContext = createContext<IApiContext>(null!);

interface IApiProviderProps {
  children: ReactNode;
}

export function ApiProvider(props: IApiProviderProps) {
  const { children } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ready, setReady] = useState(false);
  const [ctx, setCtx] = useState<IApiContext>(() => {
    const api = ApiFactory({ publicEnv });
    const me = api.credentials.me;
    return { me, api, };
  });

  useEffect(() => {
    const { api } = ctx;
    api.credentials.event.authenticated.on((me) => {
      setCtx((prev) => ({ ...prev, me, }));
    });
    api.credentials.event.unauthenticated.on(() => {
      setCtx((prev) => ({ ...prev, me: null, }));
    });

    // fire a refresh...
    api.credentials.refresh();
    // don't let children render - they may need auth...
  }, []);


  // if (!ready) return null;

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  )
}