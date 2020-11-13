import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { _ls } from '../helpers/_ls.helper';
import { useUpdate } from '../hooks/use-update.hook';

export interface IDebugModeContext {
  isOn: boolean,
  on: () => void;
  off: () => void;
  toggle: () => void;
  set: (to: boolean) => void;
}

export const DebugModeContext = createContext<IDebugModeContext>(null!);

interface IDebugModeProviderProps {
  children: ReactNode;
}


const LsDebugKey = '__debug__';
enum LsDebugFlag {
  on = 'on',
  off = 'off',
}

export function DebugModeProvider(props: IDebugModeProviderProps) {
  const { children } = props;
  // initialise to local stoarge
  const [isOn, setIsOn] = useState(() => false);
  const on = useCallback(() => setIsOn(true), []);
  const off = useCallback(() => setIsOn(false), []);
  const toggle = useCallback(() => setIsOn(prev => (!prev)), []);
  const set = useCallback((to: boolean) => setIsOn(to), []);

  const ctx: IDebugModeContext = useMemo(
    (): IDebugModeContext => ( { isOn, on, off, toggle, set }),
    [ isOn, on, off, toggle, set, ],
  );

  // load
  useEffect(() => {
    if (_ls) {
      const to = _ls?.getItem(LsDebugKey) === LsDebugFlag.on ? true : false;
      setIsOn(to);
    }
  }, [_ls]);

  // update localstorage when isOn changes (& on initialisation)
  useUpdate(() => {
    if (_ls) {
      if (isOn) { _ls?.setItem(LsDebugKey, LsDebugFlag.on); }
      else { _ls?.setItem(LsDebugKey, LsDebugFlag.off); }
    }
  }, [_ls, isOn]);

  return (
    <DebugModeContext.Provider value={ctx}>
      {children}
    </DebugModeContext.Provider>
  )
}