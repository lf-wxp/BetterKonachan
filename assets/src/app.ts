import { Vue } from 'vue-property-decorator';
import Router from 'vue-router';
import { store } from '~src/store';
import App from '~src/app.vue';
import router from '~src/router';
import { VNode, CreateElement } from 'vue';

Vue.use(Router);
// Vue.config.debug = true;
// Vue.config.warnExpressionErrors = false;

new Vue({
    el: '#app',
    store,
    router,
    render: (h: CreateElement): VNode => h(App)
});
