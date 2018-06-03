import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as koaRouter from 'koa-router';
import * as serve from 'koa-static';
import * as path from 'path';
import * as views from 'koa-views';
import * as websockify from 'koa-websocket';
import * as fs from 'fs';
import * as md5 from 'md5';
import axios from 'axios';
import Nestease from './modules/netease';
import PicData from './modules/picData';
import { User } from './database/db';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

const app = websockify(new Koa());
const router: koaRouter = new koaRouter();
const wsRouter: koaRouter = new koaRouter();
let totalPage: number = 0;
const uploadPath = path.resolve(__dirname, 'upload');
let currenUploadFile: string = '';
let connection;

async function dataConnect() {
    connection = await createConnection({
        type: 'sqlite',
        database: 'database/auth.db',
        entities: [ User ],
        synchronize: true,
        logging: false,
    });
}
dataConnect();

const connect = dataConnect();
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

router.post('/api/auth', async ctx => {
    const { name, persistent } = ctx.request.body;
    let { password } = ctx.request.body;
    password = persistent ? password : md5(password);
    const result = await User.findOne({ name, password });
    const data = { type: 'fail', data: null, msg: 'login fail' };
    if (result) {
        data.type = 'success';
        data.data = result;
        data.msg = 'login successfully';
    }
    ctx.body = data;
});

router.get('/api/auth/list', async ctx => {
    const result = await User.find();
    ctx.body = { length: result.length };
});

router.post('/api/auth/create', async ctx => {
    const { name } = ctx.request.body;
    let { password } = ctx.request.body;
    let userData;
    password = md5(password);
    const userRepository = connection.getRepository(User);
    const user  = new User();
    user.name = name;
    user.password = password;
    const data = { type: 'success', msg: 'create a new account successfully', data: null};
    try {
        userData = await userRepository.save(user);
        data.data = userData;
    } catch (error) {
        data.type = 'error';
        data.msg = error.message;
    }
    ctx.body = data;
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
    ctx.websocket.on('message', message => {
        if (typeof message === 'string') {
            if (!currenUploadFile) {
                ctx.websocket.send(
                    JSON.stringify({
                        type: 'notice',
                        data: 'success',
                    })
                );
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
})
.routes()).use(wsRouter.allowedMethods());

app
    .use(logger())
    .use(bodyParser())
    .use(viewConf)
    .use(serve('.'))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8888);
