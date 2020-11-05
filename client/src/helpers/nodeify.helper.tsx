import { ReactNode } from "react";
import { ist } from "./ist.helper";

export function nodeify(node: ReactNode): JSX.Element {
  if (ist.fn(node)) return node();
  if (ist.obj(node)) return node as JSX.Element;
  return <>{node}</>;
}
