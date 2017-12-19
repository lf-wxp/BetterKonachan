/* eslint no-param-reassign: ["error", { "props": false }] */
import Vue from 'vue';
import Vuex from 'vuex';
import {
    getLocal,
    setLocal,
} from 'base/service';

Vue.use(Vuex);

const cPage = getLocal('rememberPage') ? getLocal('currentPage') : 1;
const state = {
    totalPage: 1,
    currentPage: cPage || 1,
    tags: '',
    rememberPage: getLocal('rememberPage') || false,
    securityMode: getLocal('securityMode') || true,
};

const mutations = {
    SETTPAGE(nState, n) {
        nState.totalPage = n;
    },
    SETCPAGE(nState, n) {
        nState.currentPage = n;
        if (nState.rememberPage) {
            setLocal('currentPage', n);
        }
    },
    SETTAGS(nState, s) {
        nState.tags = s;
    },
    SETRPAGE(nState, b) {
        nState.rememberPage = b;
        setLocal('rememberPage', b);
    },
    SETSMODE(nState, b) {
        nState.securityMode = b;
        setLocal('securityMode', b);
    },
};

const getters = {
    tPage(nState) {
        return nState.totalPage;
    },
    cPage(nState) {
        return nState.currentPage;
    },
    tags(nState) {
        return nState.tags;
    },
    rPage(nState) {
        return nState.rememberPage;
    },
    sMode(nState) {
        return nState.securityMode;
    },
};

const actions = {
    setTPage({
        commit,
    }, n) {
        commit('SETTPAGE', n);
    },
    setCPage({
        commit,
    }, n) {
        commit('SETCPAGE', n);
    },
    setTags({
        commit,
    }, s) {
        commit('SETTAGS', s);
    },
    setRPage({
        commit,
    }, b) {
        commit('SETRPAGE', b);
    },
    setSMode({
        commit,
    }, b) {
        commit('SETSMODE', b);
    },
};

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
});
export default store;
