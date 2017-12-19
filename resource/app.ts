import Vue from 'vue';
import store from 'base/store';
import App from './app.vue';

/* eslint-disable no-new */
// Vue.config.debug = true;
/* ve-validator configure */
// Vue.config.warnExpressionErrors = false;


new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
