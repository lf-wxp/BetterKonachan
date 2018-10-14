import * as Router from 'koa-router';

import { index } from '~controller/common';
export const common: Router = new Router();

common.all('*', index);
