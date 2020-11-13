import { DependencyList, useCallback } from "react";
import { IIdentityFn } from "../types/identity-fn.type";

export type IUseSubmitFormReturn = React.FormEventHandler<HTMLFormElement>
export function useSubmitForm(doSubmit: IIdentityFn, deps: DependencyList): IUseSubmitFormReturn {
  const formSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    doSubmit();
  }, deps);
  return formSubmit;
}