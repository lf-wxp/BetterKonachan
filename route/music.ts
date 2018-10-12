import * as Router from 'koa-router';
import { musicList } from '@controller/music';

const router: Router = new Router({
  prefix: '/api/music',
});

router.get('/list', musicList);

export default router;
