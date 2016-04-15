import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

function getMusic(callback) {
    Vue.http.get('http://localhost:8000/music').then((response) => {
        callback(response);
    });
}

function getPost(callback, page, isSafe, tags) {
    Vue.http.get('http://localhost:8000/post', {
        tags,
        page,
        isSafe
    }).then((response) => {
        callback(response);
    });
}

function getSampleImg(callback, url) {
    Vue.http.post('http://localhost:8000/pic', {
        url
    }).then((response) => {
        callback(response);
    });
}

function getLocal(key) {
    const value = window.localStorage[key];
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else {
        return value;
    }
}

function setLocal(key, value) {
    window.localStorage[key] = value;
}

function getSession(key) {
    const value = window.sessionStorage[key];
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else {
        return value;
    }
}

function setSession(key, value) {
    window.sessionStorage[key] = value;
}
export {
    getMusic, getPost, getSampleImg, getLocal, setLocal, getSession, setSession
};
