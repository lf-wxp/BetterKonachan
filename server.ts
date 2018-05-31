import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as koaRouter from 'koa-router';
import * as serve from 'koa-static';
import * as path from 'path';
import * as views from 'koa-views';
import * as websockify from 'koa-websocket';
import * as fs from 'fs';
import axios from 'axios';
import Nestease from './modules/netease';
import PicData from './modules/picData';

const app = websockify(new Koa());
const router: koaRouter = new koaRouter();
const wsRouter: koaRouter = new koaRouter();
let totalPage: number = 0;
const uploadPath = path.resolve(__dirname, 'upload');
let currenUploadFile: string = '';
const baseMusicUrl = 'http://music.163.com/song/media/outer/url?id=';
const viewConf = views(path.join(__dirname, './assets/dist/'), {
    map: {
        html: 'swig',
    },
});

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

PicData.getPage().then(page => {
    totalPage = page;
});

router.get('/', async ctx => {
    await ctx.render('index');
});

router.get('/api/music', async ctx => {
    ctx.type = 'json';
    const data = await Nestease.playlistDetail(95815468);
    ctx.body = data;
});

router.get('/api/stream', async ctx => {
    const id = ctx.query.id;
    const res = await axios.get(`${baseMusicUrl}${id}.mp3`, {
        responseType: 'arraybuffer',
    });
    ctx.type = 'application/octet-stream';
    ctx.body = res.data;
});
router.get('/api/post', async ctx => {
    const imgs = await PicData.getData(ctx.query);
    ctx.body = {
        images: imgs,
        pages: totalPage,
    };
});

router.post('/api/pic', async ctx => {
    const res = await PicData.getSample(ctx.request.body.url);
    const base64 = res.body.toString('base64');
    ctx.body = {
        data_url: `data:${res.type};base64,${base64}`,
    };
});

router.all('*', async ctx => {
    await ctx.render('index');
});

app.ws.use(wsRouter.all('/ws/', ctx => {
    ctx.websocket.on('message', (message) => {
        if (typeof message === 'string') {
            if (!currenUploadFile) {
                ctx.websocket.send(JSON.stringify({ type: 'notice', data: 'success'}));
            }
            currenUploadFile = message;
        } else {
            try {
                fs.appendFileSync(path.resolve(uploadPath, currenUploadFile), message);
            } catch (error) {
                ctx.websocket.send(JSON.stringify({ type: 'error', data: error }));
            }
        }
        // ctx.websocket.send(`the type of the data ${message}`);
    });
}).routes()).use(wsRouter.allowedMethods());

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(serve('.'))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8888);
