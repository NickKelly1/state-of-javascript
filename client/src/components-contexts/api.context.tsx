import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { apiMeFns, IApiMe } from '../backend-api/api.me';
import { ApiFactory } from '../backend-api/api.factory';
import { PublicEnvContext } from './public-env.context';
import { IApiMeSerialized } from '../types/api-me-serialized.hinterface';
import { invoke } from '../helpers/invoke.helper';
import { IUnsubscribe } from '../helpers/ts-event';

export interface IApiContext { me: IApiMe; api: Api; }
export const ApiContext = createContext<IApiContext>(null!);
export const useApiContext = (): IApiContext => useContext(ApiContext);

interface IApiProviderProps {
  children: ReactNode;
  initialMe?: IApiMeSerialized;
}

export function ApiProvider(props: IApiProviderProps) {
  // load the initial context
  const { children, initialMe, } = props;
  const { publicEnv } = useContext(PublicEnvContext);

  const [ctx, setCtx] = useState(() => {
    const me = initialMe
      ? apiMeFns.deserialise(initialMe)
      : apiMeFns.defaultInitialMe({ ss: !process.browser });
    const api = ApiFactory({ me, publicEnv });
    api.event.authenticated;
    return { api, me };
  });

  // TODO: somehow regularly update whoami...? at the connector level...

  // don't have _can_? try to load on first run...
  useEffect(() => {
    if (process.browser && !ctx.me.can) {
      (async () => {
        try {
          const can = await ctx.api.actions();
          if (!ctx.me.can) {
            setCtx((prev) => ({
              ...prev,
              me: apiMeFns.deserialise({ ...apiMeFns.serialize(prev.me), can, }),
            }));
          }
        } catch (error) {
          // ruh roh
          console.warn('DANGER: Failed to query actions...', error);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const unsubs: IUnsubscribe[] = [];
    unsubs.push(ctx.api.event.authenticated.on((me) => setCtx((prev) => ({ ...prev, me, }))));
    unsubs.push(ctx.api.event.unauthenticated.on((me) => setCtx((prev) => ({ ...prev, me, }))));
    () => unsubs.forEach(invoke);
  }, [ctx.api.event]);

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  );
}
