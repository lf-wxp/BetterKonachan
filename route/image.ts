import Router from 'koa-router';
import { imageList } from '~controller/image';

export const image: Router = new Router({
    prefix: '/api/image'
});

image.get('/list', imageList);
