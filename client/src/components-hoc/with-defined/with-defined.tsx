import { ReactNode } from "react";
import { ist } from "../../helpers/ist.helper";
import { nodeify } from "../../helpers/nodeify.helper";
import { OrNullable } from "../../types/or-nullable.type";

interface IWithDefined<T> {
  check: OrNullable<T>;
  children: (arg: T) => ReactNode;
}

export function WithDefined<T>(props: IWithDefined<T>): null | JSX.Element {
  const { check, children } = props;
  if (ist.nullable(check)) return null;
  return nodeify(children(check));
}
