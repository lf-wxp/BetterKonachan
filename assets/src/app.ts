import Vue from 'vue';
import Router from 'vue-router';
import store from '~src/store';
import App from '~src/app.vue';
import router from '~src/router';

Vue.use(Router);
// Vue.config.debug = true;
// Vue.config.warnExpressionErrors = false;

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});
