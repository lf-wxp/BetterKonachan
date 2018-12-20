import axios, { Canceler, CancelTokenStatic, AxiosResponse } from 'axios';

import { TFuncVoid } from '~type';
import { ISong } from '~model/song';
import { IImage } from '~model/image';
import { IAuthRes } from '~model/authData';
import { IUser } from '~model/user';
import { IZipFile } from '~model/zipFile';
import { IResponse } from '~model/response';
import { IService, IServiceOpt, IServiceRes } from '~cModel/service';

const CancelToken: CancelTokenStatic = axios.CancelToken;

class Service<Q> {
    private cancelToken!: Canceler;
    private opts: IServiceOpt;
    constructor({ method = 'get', ...opts }: IServiceOpt = {}) {
        this.opts = { method, ...opts };
    }
    public async http(data: IServiceOpt): Promise<AxiosResponse<Q> | Error> {
        return axios({
            ...this.opts,
            ...(<object>data),
            cancelToken: new CancelToken((c: TFuncVoid): void => {
                this.cancelToken = c;
            })
        })
        .catch((e: Error) => {
            return e;
        });
    }
    public cancel(): void {
        if (this.cancelToken) {
            this.cancelToken();
        }
    }
}

const getMusic: IService<IResponse<ISong[]>> = new Service({
    url: '/api/music/list'
});

const getStream: IService<IResponse<Buffer>> = new Service({
    url: '/api/stream',
    responseType: 'arraybuffer'
});

const getPost: IService<IResponse<IImage>> = new Service({
    url: '/api/image/list'
});

const authorize: IService<IResponse<IUser>> = new Service({
    url: '/api/user/auth',
    method: 'post'
});

const userList: IService<IResponse<IUser[]>> = new Service({
    url: '/api/user/list'
});

const createAccount: IService<IResponse<IUser>> = new Service({
    url: '/api/user/create',
    method: 'post'
});

const getFileList: IService<IResponse<IZipFile[]>> = new Service({
    url: '/api/file/list'
});

const extract: IService<IResponse<string>> = new Service({
    method: 'post',
    url: '/api/file/extract'
});

export {
    getMusic,
    getStream,
    getPost,
    getFileList,
    authorize,
    userList,
    createAccount,
    extract
};
