import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Api } from '../backend-api/api';
import { ApiFactory } from '../backend-api/api.factory';
import { Cms } from '../cms/cms';
import { CmsFactory } from '../cms/cms.factory';
import { NpmsApi } from '../npms-api/npms-api';
import { NpmsApiFactory } from '../npms-api/npms-api.factory';
import { PublicEnvContext } from './public-env.context';

interface ICmsContext {
  cms: Cms;
}

export const CmsContext = createContext<ICmsContext>(null!);

interface ICmsProviderProps {
  children: ReactNode;
}

export function CmsProvider(props: ICmsProviderProps) {
  const { children } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const [ctx, setCtx] = useState<ICmsContext>(() => ({ cms: CmsFactory({ publicEnv }) }));

  return (
    <CmsContext.Provider value={ctx}>
      {children}
    </CmsContext.Provider>
  )
}