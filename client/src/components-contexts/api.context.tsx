/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Api } from '../backend-api/api';
import { apiMeFns, IApiMe } from '../backend-api/api.me';
import { ApiFactory } from '../backend-api/api.factory';
import { PublicEnvContext } from './public-env.context';
import { IApiMeSerialized } from '../types/api-me-serialized.hinterface';
import { invoke } from '../helpers/invoke.helper';
import { IUnsubscribe } from '../helpers/ts-event';
import SocketIO from 'socket.io-client';
import { useSnackbar } from 'notistack';
import { useDebugMode } from './debug-mode.context';
import { useClientEffect } from '../hooks/use-client-effect.hook';
import { ISocketMessage, SocketMessageType } from '../backend-api/socket.message';

export interface IApiContext { me: IApiMe; api: Api; }
export const ApiContext = createContext<IApiContext>(null!);
export const useApiContext = (): IApiContext => useContext(ApiContext);

interface IApiProviderProps {
  children: ReactNode;
  initialMe?: IApiMeSerialized;
}

export function ApiProvider(props: IApiProviderProps): JSX.Element {
  // load the initial context

  const debugMode = useDebugMode();
  const { children, initialMe, } = props;
  const { publicEnv } = useContext(PublicEnvContext);
  const { enqueueSnackbar, } = useSnackbar();

  // socket
  const [socket] = useState<SocketIO.Socket>(() => {
    const _socket = SocketIO.io(`${publicEnv.API_URL}`, { autoConnect: false, });
    return _socket;
  });

  /**
   * Console logs
   */
  useClientEffect(() => {
    if (process.browser) {
      const handleConnect = () => { console.log('ApiProvider::socket::on::connect') };
      const handleMessage = (message: string) => { console.log(`ApiProvider::socket::on::message: ${message}`) };
      const handleReconnect = () => { console.log('ApiProvider::socket::on::reconnect') };
      const handleReconnect_attempt = () => { console.log('ApiProvider::socket::on::reconnect_attempt') };
      const handleReconnect_error = () => { console.log('ApiProvider::socket::on::reconnect_error') };
      const handleReconnect_failed = () => { console.log('ApiProvider::socket::on::reconnect_failed') };
      const handlePing = () => { console.log('ApiProvider::socket::on::ping') };
      const handlePong = () => { console.log('ApiProvider::socket::on::pong') };
      const handleDisconnect = () => { console.log('ApiProvider::socket::on::disconnect') };
      const handleConnect_error = () => { console.log('ApiProvider::socket::on::connect_error') };
      socket.on('connect', handleConnect);
      socket.on('message', handleMessage);
      socket.on('reconnect', handleReconnect);
      socket.on('reconnect_attempt', handleReconnect_attempt);
      socket.on('reconnect_error', handleReconnect_error);
      socket.on('reconnect_failed', handleReconnect_failed);
      socket.on('ping', handlePing);
      socket.on('pong', handlePong);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnect_error);
      if (!socket.connected) {
        console.log('connecting...');
        socket.connect();
      }
      return () => {
        socket.off('connect', handleConnect);
        socket.off('message', handleMessage);
        socket.off('reconnect', handleReconnect);
        socket.off('reconnect_attempt', handleReconnect_attempt);
        socket.off('reconnect_error', handleReconnect_error);
        socket.off('reconnect_failed', handleReconnect_failed);
        socket.off('ping', handlePing);
        socket.off('pong', handlePong);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnect_error);
        socket.disconnect();
      };
    }
  }, [process.browser]);

  /**
   * Debug Snackbars
   */
  useClientEffect(() => {
    if (process.browser && debugMode.isOn) {
      const handleConnect = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::connect', { variant: 'success', })});
      const handleMessage = ((message: string) => { enqueueSnackbar(`Debug::ApiProvider::socket::on::message: ${message}`, { variant: 'info', })})
      const handleReconnect = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::reconnect', { variant: 'success', }) });
      const handleReconnect_attempt = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::reconnect_attempt', { variant: 'info', }) });
      const handleReconnect_error = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::reconnect_error', { variant: 'error', }) });
      const handleReconnect_failed = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::reconnect_failed', { variant: 'error', }) });
      const handlePing = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::ping', { variant: 'info', }) });
      const handlePong = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::pong', { variant: 'info', }) });
      const handleDisconnect = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::disconnect', { variant: 'warning', }) });
      const handleConnect_error = (() => { enqueueSnackbar('Debug::ApiProvider::socket::on::connect_error', { variant: 'error', }) });
      socket.on('connect', handleConnect);
      socket.on('message', handleMessage);
      socket.on('reconnect', handleReconnect);
      socket.on('reconnect_attempt', handleReconnect_attempt);
      socket.on('reconnect_error', handleReconnect_error);
      socket.on('reconnect_failed', handleReconnect_failed);
      socket.on('ping', handlePing);
      socket.on('pong', handlePong);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnect_error);
      return () => {
        socket.off('connect', handleConnect);
        socket.off('message', handleMessage);
        socket.off('reconnect', handleReconnect);
        socket.off('reconnect_attempt', handleReconnect_attempt);
        socket.off('reconnect_error', handleReconnect_error);
        socket.off('reconnect_failed', handleReconnect_failed);
        socket.off('ping', handlePing);
        socket.off('pong', handlePong);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnect_error);
      }
    }
  }, [debugMode.isOn])


  const [ctx, setCtx] = useState<IApiContext>(() => {
    const me = initialMe
      ? apiMeFns.deserialise(initialMe)
      : apiMeFns.defaultInitialMe({ ss: !process.browser });
    const api = ApiFactory({ me, publicEnv });
    return { api, me };
  });

  /**
   * Reload authorisation
   */
  useClientEffect(() => {
    if (process.browser) {
      // initial resync...
      // this is important because it will cause a mutex lock
      // which will stop downstream pages from loading until the lock releases
      // without the lock, the pages would do their initial load, then also
      // a subsequent load after authorisation is synced
      ctx.api.resyncMe();
      const handleConnect = async () => {
        if (!ctx.api.me.can) {
          // refresh if we don't have credentials yet...
          // this can be if the server was down on page load,
          // meaning the above ctx.api.resyncMe didn't load
          // and we have to re-load now that the Api is connected
          console.log('[ApiContext::on::connect] Refreshing authorised actions');
          await ctx.api.resyncMe();
        }
      }
      // subsequent resyncs...
      const handleReconnect = async () => {
        console.log('[ApiContext::on::reconnect] Refreshing authorised actions');
        await ctx.api.resyncMe();
      }
      // on resync request...
      const handleMessage = async (message: string) => {
        try {
          const json: ISocketMessage = JSON.parse(message);
          if (json.type === SocketMessageType.permissions_updated) {
            console.log('[ApiContext::on::message::resync_credentials] Refreshing authorised actions');
            ctx.api.resyncMe();
          }
        } catch (error) {
          console.error('[ApiContext::on::message::error]', error);
        }
      }
      socket.on('connect', handleConnect);
      socket.on('reconnect', handleReconnect);
      socket.on('message', handleMessage);
      return () => {
        socket.off('connect', handleConnect);
        socket.off('reconnect', handleReconnect);
        socket.off('message', handleMessage);
      }
    }
    //
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
