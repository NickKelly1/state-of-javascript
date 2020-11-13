import { ReactChildren, ReactNode, useContext, PropsWithChildren } from "react";
import { DebugModeContext } from "../../components-contexts/debug-mode.context";
import { ist } from "../../helpers/ist.helper";
import { nodeify } from "../../helpers/nodeify.helper";

interface IWhenDebugModeProps {
  children: ReactNode;
}

export function WhenDebugMode(props: IWhenDebugModeProps): JSX.Element {
  const { children } = props;
  const debugMode = useContext(DebugModeContext);
  if (!debugMode.isOn) return nodeify(null);
  return nodeify(children);
}