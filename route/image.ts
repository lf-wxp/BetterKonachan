import * as Router from 'koa-router';
import { imageList } from '@controller/image';

const router = new Router({
  prefix: '/api/image',
});

router.get('/list', imageList);

export default router;
