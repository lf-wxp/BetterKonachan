import Router from 'vue-router';
const home = async () => await import('./pages/home.vue');
const upload = async () => await import('./pages/upload.vue');
// import home from './pages/home.vue';
// import upload from './pages/upload.vue';
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
        },
    ],
});
export default router;
