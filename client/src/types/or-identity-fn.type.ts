import { IIdentityFn } from "./identity-fn.type";

export type IOrIdentityFn<T> = T | IIdentityFn<T>;