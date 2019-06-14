import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import assets from 'koa-static';
import views from 'koa-views';
import path from 'path';
import websockify from 'koa-websocket';
import 'reflect-metadata';

import { fileInit } from '~controller/file';
import { PORT } from '~config';
import { router, ws } from '~route/index';

fileInit();
const app: websockify.App = websockify(new Koa());
const viewConf: Koa.Middleware = views(
    path.resolve(__dirname, './assets/dist/'),
    {
        map: {
            html: 'swig'
        }
    }
);

//@ts-ignore
app.ws.use(ws.routes()).use(ws.allowedMethods());

app.use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(assets('.'))
    .use(router())
    .listen(PORT);
