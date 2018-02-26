import Vue from 'vue';
import store from './store';
import App from './app.vue';

// Vue.config.debug = true;
// Vue.config.warnExpressionErrors = false;


new Vue({
    el: '#app',
    store,
    render: (h) => h(App),
});
