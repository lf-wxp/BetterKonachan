export type TFunc1Void<T> = (x: T) => void;
export type TFunc2Void<T, P> = (x: T, y: P) => void;
export type TFunc1<T, P> = (x: T) => P;
export type TFunc2<T, L, P> = (x: T, y: L) => P;
export type TFunc3<T, L, S, P> = (x: T, y: L, z: S) => P;
export type TFuncVoid<T = void> = () => T;
export type TFuncVoidReturn<T> = () => T;
