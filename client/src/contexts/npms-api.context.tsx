import React, { createContext, ReactNode, useContext, useState } from 'react';
import { NpmsApi } from '../npms-api/npms-api';
import { NpmsApiFactory } from '../npms-api/npms-api.factory';
import { PublicEnvContext } from './public-env.context';

interface INpmsApiContext {
  npmsApi: NpmsApi;
}

export const NpmsApiContext = createContext<INpmsApiContext>(null!);

interface INpmsApiProviderProps {
  children: ReactNode;
}

export function NpmsApiProvider(props: INpmsApiProviderProps) {
  const { children } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ctx, setCtx] = useState<INpmsApiContext>(() => ({ npmsApi: NpmsApiFactory({ publicEnv }) }));

  return (
    <NpmsApiContext.Provider value={ctx}>
      {children}
    </NpmsApiContext.Provider>
  )
}