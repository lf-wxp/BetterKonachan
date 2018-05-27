import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as koaRouter from 'koa-router';
import * as serve from 'koa-static';
import * as path from 'path';
import * as views from 'koa-views';
import axios from 'axios';
import Nestease from './modules/netease';
import PicData from './modules/picData';

const app: Koa = new Koa();
const router: koaRouter = new koaRouter();
let totalPage: number  = 0;

const baseMusicUrl = 'http://music.163.com/song/media/outer/url?id=';

const viewConf = views(path.join(__dirname, './assets/dist/'), {
    map: {
        html: 'swig',
    },
});

PicData.getPage().then((page) => {
    totalPage = page;
});

router.get('/', async (ctx) => {
    await ctx.render('index');
});

router.get('/music', async (ctx) => {
    ctx.type = 'json';
    const data = await Nestease.playlistDetail(95815468);
    ctx.body = data;
});

router.get('/stream', async (ctx) => {
    const id = ctx.query.id;
    const res = await axios.get(`${baseMusicUrl}${id}.mp3`, {
        responseType: 'arraybuffer',
    });
    ctx.type = 'application/octet-stream';
    ctx.body = res.data;
});
router.get('/post', async (ctx) => {
    const imgs = await PicData.getData(ctx.query);
    ctx.body = {
        images: imgs,
        pages: totalPage,
    };
});

router.post('/pic', async (ctx) => {
    const res = await PicData.getSample(ctx.request.body.url);
    const base64 = res.body.toString('base64');
    ctx.body = {
        data_url: `data:${res.type};base64,${base64}`,
    };
});

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(router.routes())
    .use(serve('.'))
    .use(router.allowedMethods())
    .listen(8888);
