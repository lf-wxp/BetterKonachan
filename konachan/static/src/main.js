import Vue from 'vue';
import App from './app.vue';

/* eslint-disable no-new */
Vue.config.debug = true;
/* vue-validator configure*/
Vue.config.warnExpressionErrors = false;
new Vue({
    el: 'body',
    components: {
        App
    }
});
