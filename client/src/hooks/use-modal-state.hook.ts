import { useCallback, useMemo, useState } from "react";
import { IIdentityFn } from "../types/identity-fn.type";

export interface IUseModalStateReturn {
  isOpen: boolean;
  setIsOpen: (to: boolean) => any;
  doToggle: IIdentityFn;
  doClose: IIdentityFn;
  doOpen: IIdentityFn;
}
export function useModalState(initial?: boolean): IUseModalStateReturn {
  const [isOpen, setIsOpen] = useState<boolean>(!!initial);
  const doClose = useCallback(() => setIsOpen(false), []);
  const doOpen = useCallback(() => setIsOpen(true), []);
  const doToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const state: IUseModalStateReturn = useMemo(
    () => ({ isOpen, setIsOpen, doToggle, doClose, doOpen, }),
    [ isOpen, setIsOpen, doToggle, doClose, doOpen, ],
  );
  return state;
}