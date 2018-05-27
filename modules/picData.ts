import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

const baseUrlXml = 'https://konachan.net/post.xml';
const baseUrlJson = 'https://konachan.net/post.json';
const defaultSize = 21;

class PicData {
    public static  async getPage() {
        const res = await axios.get(baseUrlXml);
        const $ = cheerio.load(res.data);
        return Math.ceil(Number.parseInt($('posts').attr('count'), 10) / defaultSize);
    }

    public static formatUrl(url: string) {
        return `https:${url.replace(/(?<=konachan\.)net/, 'com')}`;
    }

    public static async getData({
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
        res.data.forEach((value, index) => {
            imgs.push({
                id: index,
                url: PicData.formatUrl(value.file_url),
                sample_width: value.sample_width,
                width: value.width,
                sample_height: value.sample_height,
                sample: PicData.formatUrl(value.sample_url),
                preview_width: value.actual_preview_width,
                preview_height: value.actual_preview_height,
                height: value.height,
                prev_url: PicData.formatUrl(value.preview_url),
                security: value.rating === 's' ? true : false,
                name: value.md5 + path.extname(value.file_url),
            });
        });
        return imgs;
    }
    public static async getSample(url) {
        const res = await axios.get(`https:${url}`);
        return {
            body: res.data,
            type: res.headers['content-type'],
        };
    }
}

export default PicData;
