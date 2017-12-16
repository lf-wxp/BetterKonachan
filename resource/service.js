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

function getSampleImg(url) {
    return axios.get('/pic', {
        params: {
            url,
        },
    });
}

function getLocal(key) {
    const value = window.localStorage.getItem(key);
    let result;
    if (value === 'true') {
        result = true;
    } else if (value === 'false') {
        result = false;
    } else {
        result = Number.parseInt(value, 10) || value;
    }
    return result;
}

function setLocal(key, value) {
    window.localStorage.setItem(key, value);
}

function getSession(key) {
    const value = window.sessionStorage.getItem(key);
    let result;
    if (value === 'true') {
        result = true;
    } else if (value === 'false') {
        result = false;
    } else {
        result = Number.parseInt(value, 10) || value;
    }
    return result;
}

function setSession(key, value) {
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
