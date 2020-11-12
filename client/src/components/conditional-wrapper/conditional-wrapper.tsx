import { PropsWithChildren, ReactNode } from "react";
import { INodeable, nodeify } from "../../helpers/nodeify.helper";
import { OrNullable } from "../../types/or-nullable.type";

interface IConditionalWrapperProps {
  children: INodeable;
  wrapper?: OrNullable<false | ((children: ReactNode) => INodeable)>;
  otherwise?: OrNullable<false | ((children: ReactNode) => INodeable)>;
}

export function ConditionalWrapper(props: IConditionalWrapperProps) {
  const { children, wrapper, otherwise } = props;
  const _children = nodeify(children);
  if (wrapper) { return nodeify(wrapper(_children)); }
  if (otherwise) { return nodeify(otherwise(_children)); }
  return _children;
}
