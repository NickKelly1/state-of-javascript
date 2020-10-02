import React, { ReactNode } from 'react'
import { useMounted } from '../../hooks/use-mounted.hook';

export interface IWithoutFirstLoadProps {
  children: ReactNode;
}

/**
 * Some stuff like dashboards can't reconcile server render with client render
 * This avoids server render
 * 
 * @param props
 */
export function WithoutFirstLoad(props: IWithoutFirstLoadProps): null | JSX.Element {
  const { children } = props;
  const mounted = useMounted();
  if (!mounted) return null;
  return <>{children}</>;
}