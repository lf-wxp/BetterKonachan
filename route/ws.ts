import Router from 'koa-router';
import { fileUpload } from '~controller/file';

export const ws: Router = new Router({
    prefix: '/ws'
});

ws.all('/upload', fileUpload);
