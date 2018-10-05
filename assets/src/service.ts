import axios, { Canceler } from 'axios';

const CancelToken = axios.CancelToken;

class Service implements IService {
    private cancelToken!: Canceler;
    private opts: object;
    constructor({
        method = 'get',
        ...opts
    }: { method?: string; [propName: string]: any } = {}) {
        this.opts = { method, ...opts };
    }
    public http(data: object = {}) {
        return axios({
            ...this.opts,
            ...data,
            cancelToken: new CancelToken((c: () => void) => {
                this.cancelToken = c;
            }),
        }).catch(e => {
            return e;
        });
    }
    public cancel() {
        if (this.cancelToken) {
            this.cancelToken();
        }
    }
}

const getMusic = new Service({
    url: '/api/music/list',
});

const getStream = new Service({
    url: '/api/stream',
    responseType: 'arraybuffer',
});

const getPost = new Service({
    url: '/api/image/list',
});

const authorize = new Service({
    url: '/api/user/auth',
    method: 'post',
});

const userList = new Service({
    url: '/api/user/list',
});

const createAccount = new Service({
    url: '/api/user/create',
    method: 'post',
});

const getFileList = new Service({
    url: '/api/file/list',
});

const extract = new Service({
    method: 'post',
    url: '/api/file/extract',
});

export {
    getMusic,
    getStream,
    getPost,
    getFileList,
    authorize,
    userList,
    createAccount,
    extract,
};
