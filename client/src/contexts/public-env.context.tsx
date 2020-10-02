import React, { createContext, ReactNode, useState } from 'react';
import { PublicEnv, PublicEnvSingleton } from '../env/public-env.helper';

interface IPublicEnvContext {
  publicEnv: PublicEnv;
}

const initial: IPublicEnvContext = { publicEnv: PublicEnvSingleton };

export const PublicEnvContext = createContext<IPublicEnvContext>(initial);

interface IPublicEnvProviderProps {
  publicEnv: PublicEnv;
  children: ReactNode;
}

export function PublicEnvProvider(props: IPublicEnvProviderProps) {
  const { children, publicEnv } = props;
  const [ctx, setCtx] = useState<IPublicEnvContext>(initial);

  return (
    <PublicEnvContext.Provider value={ctx}>
      {children}
    </PublicEnvContext.Provider>
  )
}