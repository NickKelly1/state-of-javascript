import { ComponentType, DetailedHTMLProps, FormEventHandler, FormHTMLAttributes, ReactNode, useCallback, useRef, useState } from "react";
import { ist } from "../../helpers/ist.helper";
import { IIdentityFn } from "../../types/identity-fn.type";
import { IOrIdentityFn } from "../../types/or-identity-fn.type";
import { OrNullable } from "../../types/or-nullable.type";

/**
 * HOC
 * Wraps component in a form
 * Provides a "handleFormSubmit" cb that gets run upon form submission
 * Hot-swaps with refs under the hood so changing the submitFn doesn't cause re-renders
 *
 * @deprecated
 */
export interface IWithFormProps { onSubmitForm: (sumbitFn: IIdentityFn) => any; }
type IFormProps = DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
/*
 * @deprecated
 */
export function WithForm<P extends IWithFormProps>(formProps?: IFormProps | ((props: Omit<P, keyof IWithFormProps>) => IFormProps)) {
  return function WithFormComponent(Comp: React.ComponentType<P>): ComponentType<Omit<P, keyof IWithFormProps>> {
    return function WithFormRenderer(props: Omit<P, keyof IWithFormProps>): JSX.Element {
      const fProps = ist.fn(formProps) ? formProps(props) : formProps;
      const childSubmitRef = useRef<OrNullable<IIdentityFn>>();
      const setChildSubmitRef = useCallback((submitFn: IIdentityFn) => { childSubmitRef.current = submitFn; }, []);
      const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
        evt.preventDefault();
        childSubmitRef.current?.();
      }, []);
      return (
        <form {...fProps} onSubmit={handleSubmit}>
          <Comp {...props as P} onSubmitForm={setChildSubmitRef} />
        </form>
      )
    }
  }
}
