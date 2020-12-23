import React, { ComponentType, ReactElement } from "react";
import { IApiContext, useApiContext } from "../../components-contexts/api.context";

type IWithApiProvidedProps = IApiContext;

/**
 * Provide a fully loaded Api instance to the Component's props
 *
 * @param Component
 * @param arg
 */
export function WithApi<P>(
  Component: ComponentType<P & IWithApiProvidedProps>,
): ComponentType<P> {
  const DoWithApi: React.FC<P> = (props: P): ReactElement => {
    const apiCtx = useApiContext();
    return <Component {...props as P} {...apiCtx as IWithApiProvidedProps} />;
  }
  return DoWithApi;
}
