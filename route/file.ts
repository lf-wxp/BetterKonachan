import Router from 'koa-router';
import { fileExtract, fileList, fileUpload } from '~controller/file';

export const file: Router = new Router({
    prefix: '/api/file'
});

file.get('/list', fileList);
file.post('/extract', fileExtract);
file.all('/upload/', fileUpload);
