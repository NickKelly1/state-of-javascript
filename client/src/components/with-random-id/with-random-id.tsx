import { DependencyList, ReactElement, ReactNode, ReactText, useMemo } from "react";
import { ist } from "../../helpers/ist.helper";
import { nodeify } from "../../helpers/nodeify.helper";
import { useRandomId } from "../../hooks/use-random-id.hook";

export interface IWithRandomIdProps {
  deps?: DependencyList;
  children: (id: string) => ReactNode;
}

export function WithRandomId<R>(props: IWithRandomIdProps): JSX.Element {
  const { children, deps } = props;
  const id = useRandomId(deps ?? []);
  return nodeify(children(id));
}