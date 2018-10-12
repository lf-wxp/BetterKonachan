import * as Router from 'koa-router';

import { index } from '@controller/common';
const route: Router = new Router();

route.all('*', index);

export default route;
