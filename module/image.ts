import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

import { IMAGEPAGESIZE, IMAGEURLJSON, IMAGEURLXML } from '~config';

import { IImage, IResImage } from '~model/image';

export namespace Image {
    export async function getPage(): Promise<number> {
        const res: AxiosResponse<string> = await axios.get(IMAGEURLXML);
        const $: CheerioStatic = cheerio.load(res.data);

        return Math.ceil(
            Number.parseInt($('posts')
            .attr('count'), 10) / IMAGEPAGESIZE
        );
    }

    export function formatUrl(url: string): string {
        return `${url.replace(/(?<=konachan\.)net/, 'com')}`;
    }

    export async function getData({
        page = 1,
        tags = ''
    }: {
        page: number;
        tags: string;
    }): Promise<IImage[]> {
        const res: AxiosResponse<IResImage[]> = await axios.get(IMAGEURLJSON, {
            params: {
                page,
                tags
            }
        });

        const imgs: IImage[] = [];
        res.data.forEach(
            (value: IResImage, index: number): void => {
                imgs.push({
                    id: index,
                    url: formatUrl(value.file_url),
                    sampleWidth: value.sample_width,
                    width: value.width,
                    sampleHeight: value.sample_height,
                    sample: formatUrl(value.sample_url),
                    previewWidth: value.actual_preview_width,
                    previewHeight: value.actual_preview_height,
                    height: value.height,
                    preview: formatUrl(value.preview_url),
                    security: value.rating === 's' ? true : false,
                    name: value.md5 + path.extname(value.file_url)
                });
            }
        );

        return imgs;
    }
}
