import { useCallback, useMemo, useState } from "react";
import { IIdentityFn } from "../types/identity-fn.type";

export interface IUseDialogReturn {
  isOpen: boolean;
  setIsOpen: (to: boolean) => any;
  doToggle: IIdentityFn;
  doClose: IIdentityFn;
  doOpen: IIdentityFn;
}
export function useDialog(initial?: boolean): IUseDialogReturn {
  const [isOpen, setIsOpen] = useState<boolean>(!!initial);
  const doClose = useCallback(() => setIsOpen(false), []);
  const doOpen = useCallback(() => setIsOpen(true), []);
  const doToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const state: IUseDialogReturn = useMemo(
    () => ({ isOpen, setIsOpen, doToggle, doClose, doOpen, }),
    [ isOpen, setIsOpen, doToggle, doClose, doOpen, ],
  );
  return state;
}