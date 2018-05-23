import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        bgUrl: '',
        tags: '',
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
    },
});
