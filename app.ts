import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as assets from 'koa-static';
import * as views from 'koa-views';
import * as path from 'path';
import * as websockify from 'koa-websocket';

import { fileInit } from '@controller/file';
import { PORT } from '@config';

import router from '@route/index';

fileInit();
const app = websockify(new Koa());
const viewConf = views(path.resolve(__dirname, './assets/dist/'), {
  map: {
    html: 'swig',
  },
});

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(assets('.'))
    .use(router())
    .listen(PORT);
