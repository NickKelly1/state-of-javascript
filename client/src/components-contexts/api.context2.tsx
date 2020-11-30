import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { ApiFactory, ApiFactoryArgType } from '../backend-api/api.factory';
import { OrNull } from '../types/or-null.type';
import { PublicEnvContext } from './public-env.context';
import { IApiMeSerialized } from '../types/api-me-serialized.hinterface';
import { ApiException } from '../backend-api/api.exception';
import { normaliseApiException, rethrow } from '../backend-api/normalise-api-exception.helper';
import { IUnsubscribe } from '../helpers/ts-event';
import { invoke } from '../helpers/invoke.helper';
import { useAsync } from '../hooks/use-async.hook';
import { IApiException } from '../backend-api/types/api.exception.interface';
import { OrUndefined } from '../types/or-undefined.type';
import { IAsyncState } from '../types/async.types';
import { useUpdate } from '../hooks/use-update.hook';
import { IApiMe } from '../backend-api/api.me';


interface IApi {
  me: IApiMe;
  login(arg: IApiCredentialsLoginArg): Promise<LoginMutation>;
  refresh(): Promise<RefreshMutation>;
  logout(): Promise<LogoutMutation>;
  register(arg: IApiCredentialsRegisterArg): Promise<RegisterMutation>;
  consumeEmailVerification(arg: IApiCredentialsVerifyEmailArg): Promise<ConsumeEmailVerificationMutation>;
  consumeResetPassword(arg: IApiCredentialsResetPasswordArg): Promise<ConsumeResetPasswordMutation>;
  consumeUserWelcome(arg: IApiCredentialsConsumeUserWelcomeArg): Promise<ConsumeUserWelcomeMutation>;
  consumeEmailChangeVerification(arg: IApiCredentialsConsumeChangeVerificationArg): Promise<ConsumeEmailChangeVerificationMutation>;
  gql<T = any, V = Variables>(doc: RequestDocument, vars: V): Promise<T>;
}

export interface IApiContextValue { me: IApiMe, api: Api; }
export type IApiContext = IAsyncState<IApiContextValue, ApiException>;
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

  // initial load - me given by server
  // 1 - receive me
  // 2 - deserialize me
  // 3 - create api
  // 4 - provide memoised helper functions on api
  // 5 - life is good
  
  // initial load - me NOT given by server
  // 1 - receive no me
  // 2 - start loading can's
  // ...

  const [ctx, setCtx] = useState(() => {
    if (initialMe) {
      // okay path...
    }

    else {
      // sad path
    }
  })

  // // lazy load api/me if not given by server...
  // const [_, ctx2] = useAsync<IApiContextValue, IApiException>({
  //   fn: async (): Promise<IApiContextValue> => {
  //     const api = await ApiFactory({
  //       publicEnv,
  //       type: ApiFactoryArgType.WithoutCredentials,
  //       me: undefined,
  //     }).catch(rethrow(normaliseApiException))
  //     const me = api.me;
  //     return { api, me, };
  //   },
  //   initial: (): OrUndefined<IApiContextValue> => {
  //     if (!initialMe) return undefined;
  //     const me = ApiMe.deserialize(initialMe);
  //     const api = ApiFactory({ publicEnv, type: ApiFactoryArgType.WithMe, me, });
  //     return { me, api, };
  //   },
  //   deps: [],
  // })

  // const [ctx, setCtx] = useState(() => ctx2);
  // useUpdate(() => { setCtx(ctx2); }, [ctx2]);

  // // update on authentication events when possible...
  // useEffect(() => {
  //   if (ctx.value) {
  //     const unsubs: IUnsubscribe[] = [];
  //     unsubs.push(ctx.value.api.event.authenticated.on((me) => setCtx((prev) => ({ ...prev, me, }))));
  //     unsubs.push(ctx.value.api.event.unauthenticated.on((me) => setCtx((prev) => ({ ...prev, me, }))));
  //     () => unsubs.forEach(invoke);
  //   }
  // }, [ctx.value]);

  // having problemos...

  return (
    <ApiContext.Provider value={ctx}>
      {children}
    </ApiContext.Provider>
  );
}

// interface IApiProviderContentProps {
//   children: ReactNode;
//   incomingCtx: IApiContext;
// }
// export function ApiProviderContent(props: IApiProviderContentProps) {
//   // take the initial context & load change made to it

//   const { children, incomingCtx, } = props;
//   const { publicEnv } = useContext(PublicEnvContext);
//   const [ready, setReady] = useState(false);

//   const [ctx, setCtx] = useState<IApiContext>(incomingCtx);
//   useEffect(() => incomingCtx)

//   useEffect(() => {
//     const { api } = ctx;
//     const unsubs: IUnsubscribe[] = [];
//     unsubs.push(api.event.authenticated.on((me) => {
//       setCtx((prev) => ({ ...prev, me, }));
//     }));
//     unsubs.push(api.event.unauthenticated.on((me) => {
//       setCtx((prev) => ({ ...prev, me, }));
//     }));
//     () => { unsubs.forEach(unsub => unsub()); }
//   }, []);

//   return (
//     <ApiContext.Provider value={ctx}>
//       {children}
//     </ApiContext.Provider>
//   )
// }
