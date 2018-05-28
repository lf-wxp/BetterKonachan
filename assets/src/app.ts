import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import App from './app.vue';
import router from './router';

Vue.use(Router);
// Vue.config.debug = true;
// Vue.config.warnExpressionErrors = false;

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});
