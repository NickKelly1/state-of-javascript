import { MouseEventHandler, useState, useCallback, useMemo } from "react";
import { IIdentityFn } from "../types/identity-fn.type";

export interface IUseMenuReturn {
  isOpen: boolean;
  anchor: HTMLElement | null;
  doOpen: MouseEventHandler<HTMLButtonElement>;
  doClose: IIdentityFn;
}
export function useMenu(): IUseMenuReturn {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const doOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback((evt) => { setAnchor(evt.currentTarget); }, [setAnchor]);
  const doClose = useCallback(() => setAnchor(null), [setAnchor]);
  const state = useMemo(
    () => ({ isOpen: !!anchor, anchor, doOpen, doClose }),
    [anchor, doOpen, doClose],
  );
  return state;
}