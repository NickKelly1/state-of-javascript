import { ReactNode } from "react";
import { ist } from "./ist.helper";

export type INodeable = ReactNode | (() => ReactNode);
export function nodeify(node: INodeable): JSX.Element {
  if (ist.fn(node)) return nodeify(node());
  if (ist.obj(node)) return node as JSX.Element;
  return <>{node}</>;
}
