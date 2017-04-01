import Vue from 'vue';
import App from './app.vue';
import store from 'store/store';
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';

/* eslint-disable no-new */
Vue.config.debug = true;
/* vue-validator configure*/
Vue.config.warnExpressionErrors = false;

Vue.use(VueResource);
Vue.use(VeeValidate);

new Vue({
    store,
    ...App
}).$mount("#app");