import Vuex from 'vuex';
import Vue from 'vue';
import defaultBg from 'image/bg.jpg';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        bgUrl: defaultBg,
        tags: '',
        page: 1,
        totalPage: 0,
        security: true,
    },
    getters: {
        GETBGURL(state) {
            return state.bgUrl;
        },
        GETTAGS(state) {
            return state.tags;
        },
        GETSECURITY(state) {
            return state.security;
        },
        GETPAGE(state) {
            return state.page;
        },
        GETTOTALPAGE(state) {
            return state.totalPage;
        },
    },
    mutations: {
        SETBG(state, str: string) {
            state.bgUrl = str;
        },
        SETTAGS(state, str: string) {
            state.tags = str;
        },
        SETSECURITY(state, mode: boolean) {
            state.security = mode;
        },
        SETPAGE(state, page: number) {
            state.page = page;
        },
        SETTOTALPAGE(state, page: number) {
            state.totalPage = page;
        },
    },
});
