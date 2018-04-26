import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

const baseUrlXml = 'http://konachan.net/post.xml';
const baseUrlJson = 'http://konachan.net/post.json';
const defaultSize = 21;

class PicData {
    public static  async getPage() {
        const res = await axios.get(baseUrlXml);
        const $ = cheerio.load(res.data);
        return Math.ceil(Number.parseInt($('posts').attr('count'), 10) / defaultSize);
    }
    public static async getData({
        isSafe = true,
        page = 1,
        tags = '',
    } = {}) {
        const res = await axios.get(baseUrlJson, {
            params: {
                page,
                tags,
            },
        });

        const imgs = [];
        res.data.forEach((value) => {
            if (isSafe === false || value.rating === 's') {
                imgs.push({
                    url: value.file_url,
                    sample_width: value.sample_width,
                    width: value.width,
                    sample_height: value.sample_height,
                    sample: value.sample_url,
                    height: value.height,
                    prev_url: value.preview_url,
                    name: value.md5 + path.extname(value.file_url),
                });
            }
        });
        return imgs;
    }
    public static async getSample(url) {
        const res = await axios.get(`http:${url}`);
        return {
            body: res.data,
            type: res.headers['content-type'],
        };
    }
}

export default PicData;
