import axios from 'axios';

function getMusic() {
    return axios.get('/music');
}

function getPost(page = 1, isSafe = true, tags = '') {
    return axios.get('/post', {
        params: {
            tags,
            page,
            isSafe,
        },
    });
}

function getSampleImg(url: string) {
    return axios.get('/pic', {
        params: {
            url,
        },
    });
}

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
    getPost,
    getSampleImg,
    getLocal,
    setLocal,
    getSession,
    setSession,
};
