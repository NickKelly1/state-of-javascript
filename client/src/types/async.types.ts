import { OrNull } from "./or-null.type";

export interface IAsyncStateLoading<T> { isLoading: true; error: null; value: OrNull<T>; }
export interface IAsyncStateErrored<T, E> { isLoading: false; error: E; value: OrNull<T>; }
export interface IAsyncStateSuccess<T> { isLoading: false; error: null; value: T; }
export interface IAsyncStateUninitialised { isLoading: false; error: null; value: null; }
export type IAsyncState<T, E> = IAsyncStateSuccess<T> | IAsyncStateErrored<T, E> | IAsyncStateLoading<T>
export type IAsyncStateAll<T, E> = IAsyncStateSuccess<T> | IAsyncStateErrored<T, E> | IAsyncStateLoading<T> | IAsyncStateUninitialised;