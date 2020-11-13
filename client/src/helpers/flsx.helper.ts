import { IIdentityFn } from "../types/identity-fn.type";

// clsx but for functions
export const flsx = (...args: (null | undefined | IIdentityFn)[]) => () => args.forEach(arg => arg?.());