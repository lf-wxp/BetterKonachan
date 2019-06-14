import Router from 'koa-router';
import { userAuth, userCreate, userList } from '~controller/auth';

export const auth: Router = new Router({
    prefix: '/api/user'
});

auth.post('/auth', userAuth);
auth.get('/list', userList);
auth.post('/create', userCreate);
