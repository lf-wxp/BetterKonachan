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
    url: '/api/music',
});

const getStream = new Service({
    url: '/api/stream',
    responseType: 'arraybuffer',
});

const getPost = new Service({
    url: '/api/post',
});

const getFileList = new Service({
    url: '/api/files',
});

const getSampleImg = new Service({
    url: '/api/pic',
});

const authorize = new Service({
    url: '/api/auth',
    method: 'post',
});

const userList = new Service({
    url: '/api/auth/list',
});

const createAccount = new Service({
    url: '/api/auth/create',
    method: 'post',
});

const extract = new Service({
    method: 'post',
    url: '/api/extract',
});

export {
    getMusic,
    getStream,
    getPost,
    getSampleImg,
    getFileList,
    authorize,
    userList,
    createAccount,
    extract,
};
