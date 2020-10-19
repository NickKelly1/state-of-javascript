import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Api } from '../backend-api/api';
import { ApiFactory } from '../backend-api/api.factory';
import { NpmsApi } from '../npms-api/npms-api';
import { NpmsApiFactory } from '../npms-api/npms-api.factory';
import { PublicEnvContext } from './public-env.context';

interface IApiContext {
  api: Api;
}

export const ApiContext = createContext<IApiContext>(null!);

interface IApiProviderProps {
  children: ReactNode;
}

export function ApiProvider(props: IApiProviderProps) {
  const { children } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ctx, setCtx] = useState<IApiContext>(() => ({ api: ApiFactory({ publicEnv }) }));

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  )
}