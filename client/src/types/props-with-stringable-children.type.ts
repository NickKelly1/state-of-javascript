import { PropsWithChildren, ReactNode } from "react";

export type PropsWithStringableChildren<P> = P & { children?: ReactNode | string };