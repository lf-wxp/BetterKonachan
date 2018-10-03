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
import PicData from '@modules/image';
import { User } from '@db';
import { createConnection, Connection, Repository } from 'typeorm';
import { mkdirsSync, extractFile } from '@utils';
import 'reflect-metadata';

import { IContext } from '@models/context';
import { IAuthRes, IAuthReqData } from '@models/authData';
import { EStateType } from '@models/response';
import { IUser } from '@models/user';
import { TQueryResult } from '@models/database';
import { ReadStream } from 'tty';
import { IZipFile } from '@models/zipFile';

const app = websockify(new Koa());
const router: koaRouter = new koaRouter();
const wsRouter: koaRouter = new koaRouter();
let totalPage: number = 0;
const uploadPath = path.resolve(__dirname, 'upload');
const extractPath = path.resolve(__dirname, './assets/dist/media');
let currenUploadFile: string = '';
let connection: Connection;

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

const viewConf = views(path.join(__dirname, './assets/dist/'), {
    map: {
        html: 'swig',
    },
});

if (!fs.existsSync(uploadPath)) {
    mkdirsSync(uploadPath);
}

if (!fs.existsSync(extractPath)) {
    mkdirsSync(extractPath);
}

PicData.getPage().then((page: number) => {
    totalPage = page;
});

router.get('/', async (ctx: IContext) => {
    await ctx.render('index');
});

router.get('/api/music', async (ctx: IContext): Promise<void> => {
    ctx.type = 'json';
    const data: Buffer = fs.readFileSync(path.resolve(extractPath, 'data.json'));
    ctx.body = data;
});

router.get('/api/stream', async (ctx: IContext) => {
    const id: string = ctx.query.id;
    ctx.type = 'application/octet-stream';
    const stream = fs.createReadStream(path.resolve(extractPath, `${id}.mp3`));
    ctx.body = stream;
});

router.get('/api/post', async (ctx: IContext) => {
    const imgs = await PicData.getData(ctx.query);
    ctx.body = {
        images: imgs,
        pages: totalPage,
    };
});

router.post('/api/auth', async (ctx: IContext) => {
    const { name, persistent }: Pick<IAuthReqData, 'name' | 'persistent'> = ctx.request.body;
    let { password }: Pick<IAuthReqData, 'password'> = ctx.request.body;
    password = persistent ? password : md5(password);
    const result: TQueryResult<IUser> = await User.findOne({ name, password });
    const data: IAuthRes = { state: EStateType.Fail, data: null, msg: 'login fail' };
    if (result) {
        data.state = EStateType.Success;
        data.data = result;
        data.msg = 'login successfully';
    }
    ctx.body = data;
});

router.get('/api/auth/list', async (ctx: IContext) => {
    const result: TQueryResult<IUser[]> = await User.find();
    ctx.body = { length: result.length };
});

router.get('/api/files', async (ctx: IContext) => {
    const result: string[] = fs.readdirSync(uploadPath);
    ctx.body = result;
});

router.post('/api/extract', async (ctx: IContext) => {
    const { name }: IZipFile = ctx.request.body;
    const newPath: string = path.resolve(uploadPath, name);
    if (fs.existsSync(newPath)) {
        const data = await extractFile(newPath, extractPath);
        ctx.body = data;
    } else {
        ctx.body = {
            type: 'fail',
            msg: 'file is not exist',
        };
    }
});

router.post('/api/auth/create', async (ctx: IContext) => {
    const { name }: Pick<IAuthReqData, 'name'> = ctx.request.body;
    let { password }: Pick<IAuthReqData, 'password'> = ctx.request.body;
    let userData: IUser;
    password = md5(password);
    const userRepository: Repository<IUser> = connection.getRepository(User);
    const user: IUser  = new User();
    user.name = name;
    user.password = password;
    const data: IAuthRes = { state: EStateType.Success, msg: 'create a new account successfully', data: null};
    try {
        userData = await userRepository.save(user);
        data.data = userData;
    } catch (error) {
        data.state = EStateType.Success;
        data.msg = error.message;
    }
    ctx.body = data;
});

router.all('*', async (ctx: IContext) => {
    await ctx.render('index');
});

app.ws.use(wsRouter.all('/ws/', (ctx: IContext) => {
    ctx.websocket.on('message', (message) => {
        if (typeof message === 'string') {
            if (currenUploadFile) {
                ctx.websocket.send(
                    JSON.stringify({
                        type: 'success',
                    }),
                );
            } else {
                ctx.websocket.send(JSON.stringify({ type: 'notice'}));
            }
            currenUploadFile = message;
        } else {
            try {
                fs.appendFileSync(path.resolve(uploadPath, currenUploadFile), message);
                ctx.websocket.send(JSON.stringify({ type: 'notice'}));
            } catch (error) {
                ctx.websocket.send(JSON.stringify({ type: 'error', data: error }));
            }
        }
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
