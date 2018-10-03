import * as Router from 'koa-router';
import { fileExtract, fileList, fileUpload } from '@controller/file';

const router = new Router({
  prefix: '/api/file',
});

router.get('/list', fileList);
router.post('/extract', fileExtract);
router.all('/upload/', fileUpload);

export default router;
