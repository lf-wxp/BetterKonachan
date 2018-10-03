import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

import { IMAGEPAGESIZE, IMAGEURLJSON, IMAGEURLXML} from '@config';

import { IImage, IResImage } from '@model/image';

class PicData {
    public static  async getPage(): Promise<number> {
        const res = await axios.get(IMAGEURLXML);
        const $ = cheerio.load(res.data);
        return Math.ceil(Number.parseInt($('posts').attr('count'), 10) / IMAGEPAGESIZE);
    }

    public static formatUrl(url: string): string {
        return `${url.replace(/(?<=konachan\.)net/, 'com')}`;
    }

    public static async getData({
        page = 1,
        tags = '',
    } = {}): Promise<IImage[]> {
        const res = await axios.get(IMAGEURLJSON, {
            params: {
                page,
                tags,
            },
        });

        const imgs: IImage[] = [];
        res.data.forEach((value: IResImage, index: number) => {
            imgs.push({
                id: index,
                url: PicData.formatUrl(value.file_url),
                sampleWidth: value.sample_width,
                width: value.width,
                sampleHeight: value.sample_height,
                sample: PicData.formatUrl(value.sample_url),
                previewWidth: value.actual_preview_width,
                previewHeight: value.actual_preview_height,
                height: value.height,
                preview: PicData.formatUrl(value.preview_url),
                security: value.rating === 's' ? true : false,
                name: value.md5 + path.extname(value.file_url),
            });
        });
        return imgs;
    }
}

export default PicData;
