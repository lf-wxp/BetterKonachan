import { TFunc1 } from '~type';

export namespace store {
    export type TGetterFun<T> = TFunc1<IState, T>;
    export type TMutationFun<T> = (state: IState, payload: T) => void;
    export type TType<T extends keyof IState> = IState[T];

    export enum EStateKey {
        bgUrl = 'bgUrl',
        tags = 'tags',
        page = 'page',
        totalPage = 'totalPage',
        security = 'security',
        listHeight = 'listHeight',
        themeColor = 'themeColor'
    }

    export interface IState {
        bgUrl: string;
        tags: string;
        page: number;
        totalPage: number;
        security: boolean;
        listHeight: string;
        themeColor: string;
    }

    export interface IGetters {
        GETBGURL: TGetterFun<TType<EStateKey.bgUrl>>;
        GETTAGS: TGetterFun<TType<EStateKey.tags>>;
        GETSECURITY: TGetterFun<TType<EStateKey.page>>;
        GETPAGE: TGetterFun<TType<EStateKey.totalPage>>;
        GETTOTALPAGE: TGetterFun<TType<EStateKey.security>>;
        GETLISTHEIGHT: TGetterFun<TType<EStateKey.listHeight>>;
        GETTHEMECOLOR: TGetterFun<TType<EStateKey.themeColor>>;
    }

    export interface IMutations {
        SETBG: TMutationFun<TType<EStateKey.bgUrl>>;
        SETTAGS: TMutationFun<TType<EStateKey.tags>>;
        SETSECURITY: TMutationFun<TType<EStateKey.security>>;
        SETPAGE: TMutationFun<TType<EStateKey.page>>;
        SETTOTALPAGE: TMutationFun<TType<EStateKey.totalPage>>;
        SETLISTHEIGHT: TMutationFun<TType<EStateKey.listHeight>>;
        SETTHEMECOLOR: TMutationFun<TType<EStateKey.themeColor>>;
    }
}
