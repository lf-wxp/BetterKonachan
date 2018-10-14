import * as Router from 'koa-router';
import { musicList } from '~controller/music';

export const music: Router = new Router({
    prefix: '/api/music'
});

music.get('/list', musicList);
