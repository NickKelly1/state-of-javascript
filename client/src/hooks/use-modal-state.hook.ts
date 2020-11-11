import { useCallback, useMemo, useState } from "react";
import { IIdentityFn } from "../types/identity-fn.type";

export interface IUseModalStateReturn {
  isOpen: boolean;
  setIsOpen: (to: boolean) => any;
  toggle: IIdentityFn;
  close: IIdentityFn;
  open: IIdentityFn;
}
export function useModalState(): IUseModalStateReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const state: IUseModalStateReturn = useMemo(
    () => ({ isOpen, setIsOpen, toggle, close, open, }),
    [ isOpen, setIsOpen, toggle, close, open, ],
  );
  return state;
}