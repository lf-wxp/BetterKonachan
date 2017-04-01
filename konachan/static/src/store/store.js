import Vue from 'vue';
import Vuex from 'vuex';
import {
    getLocal,
    setLocal,
    getSession,
    setSession
} from 'servers/servers';

Vue.use(Vuex);

const cPage = getLocal('rememberPage') ? getLocal('currentPage') : 1;
const state = {
    totalPage: 1,
    currentPage: cPage || 1,
    tags: '',
    rememberPage: getLocal('rememberPage') || false,
    securityMode: getLocal('securityMode') || true
};

const mutations = {
    SETTPAGE(state, n) {
        state.totalPage = n;
    },
    SETCPAGE(state, n) {
        state.currentPage = n;
        state.rememberPage && setLocal('currentPage', n);
    },
    SETTAGS(state, s) {
        state.tags = s;
    },
    SETRPAGE(state, b) {
        state.rememberPage = b;
        setLocal('rememberPage', b);
    },
    SETSMODE(state, b) {
        state.securityMode = b;
        setLocal('securityMode', b);
    }
};

const getters = {
    tPage(state) {
        return state.totalPage;
    },
    cPage(state) {
        return state.currentPage;
    },
    tags(state) {
        return state.tags;
    },
    rPage(state) {
        return state.rememberPage;
    },
    sMode(state) {
        return state.securityMode;
    }
};

const actions = {
    setTPage({
        commit
    }, n) {
        commit('SETTPAGE', n);
    },
    setCPage({
        commit
    }, n) {
        commit('SETCPAGE', n);
    },
    setTags({
        commit
    }) {
        commit('SETTAGS', s);
    },
    setRPage({
        commit
    }, b) {
        commit('SETRPAGE', b);
    },
    setSMode({
        commit
    }, b) {
        commit('SETSMODE', b);
    }
};

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
export default store;