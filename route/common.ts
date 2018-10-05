import * as Router from 'koa-router';

import { index } from '@controller/common';
const route = new Router();

route.all('*', index);

export default route;
