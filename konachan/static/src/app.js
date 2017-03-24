import Vue from 'vue';
import App from './app.vue';
import VeeValidate from 'vee-validate';

/* eslint-disable no-new */
Vue.config.debug = true;
/* vue-validator configure*/
Vue.config.warnExpressionErrors = false;

Vue.use(VeeValidate);

new Vue({
    ...App
}).$mount("#app");