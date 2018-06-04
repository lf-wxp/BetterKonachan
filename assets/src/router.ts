import Router from 'vue-router';
import { authorize } from 'src/service';

const home = async () => await import('./pages/home.vue');
const upload = async () => await import('./pages/upload.vue');
const auth = async () => await import('./pages/auth.vue');
const list = async () => await import('./pages/filelist.vue');
const router = new Router({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: home,
        },
        {
            name: 'upload',
            path: '/upload',
            component: upload,
            async beforeEnter(to, from, next) {
                const res = await authorize.http({
                    data: {
                        name: window.localStorage.getItem('bk_name'),
                        password: window.localStorage.getItem('bk_password'),
                        persistent: true,
                    },
                });
                if (res.data.type === 'success') {
                    next();
                } else {
                    router.push({
                        name: 'auth',
                    });
                }
            },
        },
        {
            name: 'auth',
            path: '/auth',
            component: auth,
        },
        {
            name: 'list',
            path: '/list',
            component: list,
        },
    ],
});
export default router;
