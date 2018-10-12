import * as Router from 'koa-router';
import { userAuth, userCreate, userList } from '@controller/auth';

const router: Router = new Router({
  prefix: '/api/user',
});

router.post('/auth', userAuth);
router.get('/list', userList);
router.post('/create', userCreate);

export default router;
