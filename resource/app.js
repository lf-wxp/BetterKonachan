import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';
import Vue from 'vue';
import store from 'base/store';
import App from './app.vue';

/* eslint-disable no-new */
Vue.config.debug = true;
/* ve-validator configure */
Vue.config.warnExpressionErrors = false;

Vue.use(VueResource);
Vue.use(VeeValidate);

new Vue({
    store,
    ...App,
}).$mount('#app');
