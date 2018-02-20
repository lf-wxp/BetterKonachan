const axios = require('axios');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const baseUrlXml = 'http://konachan.net/post.xml';
const baseUrlJson = 'http://konachan.net/post.json';
let defaultSize = 21;

class PicData {
    getPage() {
        return axios.get(baseUrlXml).then((res) => {
            let $ = cheerio.load(res.data);
            return Math.ceil($('posts').attr('count') / defaultSize);
        }).catch((err) => {
            console.log(err);
        })
    }
    getData({isSafe = true, page = 1, tags = ''}) {
        return axios.get(baseUrlJson, {
            params: {
                page: page,
                tags: tags
            }
        }).then((res) => {
            let imgs = [];
            res.data.forEach((value) => {
                if (isSafe === 'false' || value.rating === 's') {
                    imgs.push({
                        url: value.file_url,
                        prev_url: value.preview_url,
                        sample: value.sample_url,
                        sample_height: value.sample_height,
                        sample_width: value.sample_width,
                        width: value.width,
                        height: value.height,
                        name: value.md5 + path.extname(value.file_url)
                    });
                }
            });
            return imgs;
        }).catch((err) => {
            console.log(err);
        });
    }
    getSample(url) {
        return new Promise((resolve, reject) => {
            request({
                url: `http:${url}`,
                encoding: null
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    resolve({
                        body, type: res.headers['content-type']
                    });
                } else {
                    reject(err);
                }
            })
        });
    }
}

module.exports = PicData;
