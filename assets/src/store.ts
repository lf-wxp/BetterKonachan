import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        bgUrl: '',
        tags: '',
    },
    getters: {
        BGURL(state) {
            return state.bgUrl;
        },
        GETTAGS(state) {
            return state.tags;
        },
    },
    mutations: {
        SETBG(state, str: string) {
            state.bgUrl = str;
        },
        SETTAGS(state, str: string) {
            state.tags = str;
        },
    },
});
