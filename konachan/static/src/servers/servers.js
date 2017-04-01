import Vue from 'vue';

function getMusic() {
    return Vue.http.get('/music');
}

function getPost(page = 1, isSafe = true, tags= '') {
    return Vue.http.get('/post', {
        tags,
        page,
        isSafe
    });
}

function getSampleImg(url) {
    return Vue.http.post('/pic', {
        url
    });
}

function getLocal(key) {
    const value = window.localStorage.getItem(key);
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else {
        return Number.parseInt(value, 10) || value;
    }
}

function setLocal(key, value) {
    window.localStorage.setItem(key,value);
}

function getSession(key) {
    const value = window.sessionStorage.getItem(key);
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else {
        return Number.parseInt(value, 10) || value;
    }
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
    setSession
};