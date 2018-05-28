import axios, { Canceler, AxiosInstance, AxiosStatic, AxiosAdapter } from 'axios';

const CancelToken = axios.CancelToken;

class Service implements IService {
    private cancelToken!: Canceler;
    private opts: object;
    constructor({ method = 'get', ...opts }: { method?: string, [propName: string]: any } = {}) {
        this.opts = { method, ...opts };
    }
    public http(data: object = {}) {
        return axios({
            ...this.opts,
            ...data,
            cancelToken: new CancelToken((c: () => void) => {
                this.cancelToken = c;
            }),
        }).catch((e) => {
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

// function getStream(id: number) {
//     return axios.get('/stream', {
//         responseType: 'arraybuffer',
//         params: {
//             id,
//         },
//     });
// }

const getPost = new Service({
    url: '/api/post',
});
// function getPost(page = 1, isSafe = true, tags = '') {
//     return axios.get('/post', {
//         params: {
//             tags,
//             page,
//             isSafe,
//         },
//     });
// }

const getSampleImg = new Service({
    url: '/api/pic',
});
// function getSampleImg(url: string) {
//     return axios.get('/pic', {
//         params: {
//             url,
//         },
//     });
// }

function getLocal(key: string) {
    const value = window.localStorage.getItem(key) || '';
    let result: boolean | number | string;
    if (value === 'true') {
        result = true;
    } else if (value === 'false') {
        result = false;
    } else {
        result = Number.parseInt(value, 10) || value;
    }
    return result;
}

function setLocal(key: string, value: string) {
    window.localStorage.setItem(key, value);
}

function getSession(key: string) {
    const value: string = window.sessionStorage.getItem(key) || '';
    let result: boolean | number | string;
    if (value === 'true') {
        result = true;
    } else if (value === 'false') {
        result = false;
    } else {
        result = Number.parseInt(value, 10) || value;
    }
    return result;
}

function setSession(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
}
export {
    getMusic,
    getStream,
    getPost,
    getSampleImg,
    getLocal,
    setLocal,
    getSession,
    setSession,
};
