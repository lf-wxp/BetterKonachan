import Router, { Route } from 'vue-router';
import { authorize } from '~service';
import { IServiceRes, isValidRes } from '~cModel/service';
import { IResponse } from '~model/response';
import { IUser } from '~model/user';
import { EStateType } from '~model/message';

// tslint:disable no-implicit-dependencies
type vueType = typeof import('*.vue');
type asyncComponent = () => Promise<vueType>;


const home: asyncComponent = (): Promise<vueType> => import('./page/home.vue');
const upload: asyncComponent = (): Promise<vueType> => import('./page/upload.vue');
const auth: asyncComponent = (): Promise<vueType> => import('./page/auth.vue');
const list: asyncComponent  = (): Promise<vueType> => import('./page/filelist.vue');
const router: Router = new Router({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: home
        },
        {
            name: 'upload',
            path: '/upload',
            component: upload,
            async beforeEnter(to: Route, source: Route, next: () => void): Promise<void> {
                const res: IServiceRes<IResponse<IUser>> | Error = await authorize.http({
                    data: {
                        name: window.localStorage.getItem('bk_name'),
                        password: window.localStorage.getItem('bk_password'),
                        persistent: true
                    }
                });
                if (isValidRes<IUser>(res) && res.data.state === EStateType.Success) {
                    next();
                } else {
                    router.push({
                        name: 'auth'
                    });
                }
            }
        },
        {
            name: 'auth',
            path: '/auth',
            component: auth
        },
        {
            name: 'list',
            path: '/list',
            component: list
        }
    ]
});
export default router;
