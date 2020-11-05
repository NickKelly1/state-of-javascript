import { ReactElement, ReactNode, ReactText, useMemo } from "react";
import { ist } from "../../helpers/ist.helper";
import { nodeify } from "../../helpers/nodeify.helper";

export interface IWithMemoProps<R> {
  deps: any[],
  memo: () => R;
  children: (take: R) => ReactElement;
}

export function WithMemo<R>(props: IWithMemoProps<R>): JSX.Element | null {
  const { children, deps, memo } = props;
  const mapped: R = useMemo(() => memo(), deps);
  return nodeify(children(mapped));
}