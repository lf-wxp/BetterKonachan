require('babel-core/register');
const Nestease = require('./lib/netease');
const PicData = require('./lib/picData');
const koa = require('koa');
const router = require('koa-router')();
const logger = require('koa-logger');
const views = require('koa-views');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const music = new Nestease();
const picdata = new PicData();
const app = new koa();
let totalPage = 0;

const viewConf = views(path.join(__dirname, 'templates'), {
    map: {
        html: 'swig'
    }
});

picdata.getPage().then((page) => {
    totalPage = page;
});

router.get('/', async(ctx, next) => {
    await ctx.render('index');
});

router.get('/test', async(ctx, next) => {
    ctx.body = 'hello world test page';
});

router.get('/music', async(ctx) => {
    ctx.type = 'json';
    let data = await music.playlist_detail(95815468);
    ctx.body = data;
});

router.get('/post', async(ctx) => {
    let imgs = await picdata.getData(ctx.query);
    ctx.body = {images: imgs, pages: totalPage};
});

router.post('/pic', async(ctx) => {
    let {body, type} = await picdata.getSample(ctx.request.body.url);
    let base64 = body.toString('base64');
    ctx.body = {
        data_url: `data:${type};base64,${base64}`
    };
});

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(router.routes())
    .use(serve(path.join(__dirname, 'asset')))
    .use(router.allowedMethods())
    // .listen(80);

module.exports = app;
