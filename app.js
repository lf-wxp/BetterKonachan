import Koa from 'koa';
import koaRouter from 'koa-router';
import logger from 'koa-logger';
import views from 'koa-views';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import Nestease from './lib/netease';
import PicData from './lib/picData';

const app = new Koa();
const router = koaRouter();
let totalPage = 0;

const viewConf = views(path.join(__dirname, 'templates'), {
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

router.get('/test', async (ctx) => {
    ctx.body = 'hello world test page';
});

router.get('/music', async (ctx) => {
    ctx.type = 'json';
    const data = await Nestease.playlistDetail(95815468);
    ctx.body = data;
});

router.get('/post', async (ctx) => {
    const imgs = await PicData.getData(ctx.query);
    ctx.body = {
        images: imgs,
        pages: totalPage,
    };
});

router.post('/pic', async (ctx) => {
    const {
        body,
        type,
    } = await PicData.getSample(ctx.request.body.url);
    const base64 = body.toString('base64');
    ctx.body = {
        data_url: `data:${type};base64,${base64}`,
    };
});

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(router.routes())
    .use(serve(path.join(__dirname, 'resource')))
    .use(router.allowedMethods())
    .listen(3000);
