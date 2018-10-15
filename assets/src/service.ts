import axios, { Canceler, CancelTokenStatic, AxiosResponse } from 'axios';

import { TFuncVoid } from '~type';
import { ISong } from '~model/song';

const CancelToken: CancelTokenStatic = axios.CancelToken;

export interface IOpt {
    method?: string;
    url?: string;
    responseType?: string;
}
export interface IService<R extends object, Q> {
    cancel(): void;
    http(data: R): Promise<AxiosResponse<Q> | Error>;
}
class Service<R extends object, Q> {
    private cancelToken!: Canceler;
    private opts: IOpt;
    constructor({ method = 'get', ...opts }: IOpt = {}) {
        this.opts = { method, ...opts };
    }
    public async http(data: R): Promise<AxiosResponse<Q> | Error> {
        return axios({
            ...this.opts,
            ...(<object>data),
            cancelToken: new CancelToken((c: TFuncVoid): void => {
                this.cancelToken = c;
            })
        }).catch((e: Error) => {
            return e;
        });
    }
    public cancel(): void {
        if (this.cancelToken) {
            this.cancelToken();
        }
    }
}

const getMusic: IService<{}, ISong[]> = new Service<{}, ISong[]>({
    url: '/api/music/list'
});

const getStream = new Service({
    url: '/api/stream',
    responseType: 'arraybuffer'
});

const getPost = new Service({
    url: '/api/image/list'
});

const authorize = new Service({
    url: '/api/user/auth',
    method: 'post'
});

const userList = new Service({
    url: '/api/user/list'
});

const createAccount = new Service({
    url: '/api/user/create',
    method: 'post'
});

const getFileList = new Service({
    url: '/api/file/list'
});

const extract = new Service({
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
