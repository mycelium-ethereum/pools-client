import { SetState, GetState } from 'zustand';

// eslint-disable-next-line @typescript-eslint/ban-types
export type StoreSlice<T extends object, E extends object = T> = (
    set: SetState<E extends T ? E : E & T>,
    get: GetState<E extends T ? E : E & T>,
) => T;

export type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      F extends (...args: any) => object
        ? StateFromFunctions<R> & ReturnType<F>
        : unknown
    : unknown;
