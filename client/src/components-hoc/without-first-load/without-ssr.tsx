import { CircularProgress } from '@material-ui/core';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useMounted } from '../../hooks/use-mounted.hook';

export interface IWithoutSsrProps {
  children: () => ReactNode;
}

/**
 * Don't render server-side...
 * 
 * @param props
 */
export function WithoutSsr<P>(Component: React.ComponentType<P>): React.ElementType<P> {
  return function WithoutSsrHoc(props: P) {
    const wasSsr = useMemo(() => !!process.browser, []);
    const [isSettled, setIsSettled] = useState(false);

    useEffect(() => {
      // first browser render should have same dom as ssr
      // after first render, allow children to render (mark settled)...
      // if (wasSsr) { if (process.browser) { setTimeout(() => setIsSettled(true), 5000); } }
      if (wasSsr) { if (process.browser) { setIsSettled(true); } }
    }, [process.browser]);

    // is ssr - don't render
    if (!process.browser) return <CircularProgress />;
    // wasn't ssr - instant browser render
    if (!wasSsr) { return <Component {...props} /> }
    // was ssr - wait for settle before render
    if (!isSettled) { return <CircularProgress />; }
    // was ssr - is settled
    return <Component {...props} />;
  }
}
