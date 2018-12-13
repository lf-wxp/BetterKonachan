// tslint:disable import-name
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import defaultBg from '~image/bg.jpg';

import { store as storeScope } from '~cModel/store';
Vue.use(Vuex);

export const store: Store<storeScope.IState> =  new Vuex.Store<storeScope.IState>({
    state: {
        bgUrl: defaultBg,
        tags: '',
        page: 1,
        totalPage: 0,
        security: true
    },
    getters: {
        GETBGURL(state: storeScope.IState): storeScope.TType<'bgUrl'> {
            return state.bgUrl;
        },
        GETTAGS(state: storeScope.IState): storeScope.TType<'tags'> {
            return state.tags;
        },
        GETSECURITY(state: storeScope.IState): storeScope.TType<'security'> {
            return state.security;
        },
        GETPAGE(state: storeScope.IState): storeScope.TType<'page'> {
            return state.page;
        },
        GETTOTALPAGE(state: storeScope.IState): storeScope.TType<'totalPage'> {
            return state.totalPage;
        }
    },
    mutations: {
        SETBG(state: storeScope.IState, str: string): void {
            state.bgUrl = str;
        },
        SETTAGS(state: storeScope.IState, str: string): void {
            state.tags = str;
        },
        SETSECURITY(state: storeScope.IState, mode: boolean): void {
            state.security = mode;
        },
        SETPAGE(state: storeScope.IState, page: number): void {
            state.page = page;
        },
        SETTOTALPAGE(state: storeScope.IState, page: number): void {
            state.totalPage = page;
        }
    }
});
