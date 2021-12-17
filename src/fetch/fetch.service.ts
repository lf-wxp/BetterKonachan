import cheerio from 'cheerio';
import { last } from 'ramda';
import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class FetchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getImage(url: string): Promise<AxiosResponse<any>> {
    const res = await this.httpService
      .get(url, {
        responseType: 'stream',
      })
      .toPromise();
    return res;
  }

  async getImages(page: string, tags: string, isSafe: boolean) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page);
    searchParams.append('tags', tags);
    const { data } = await this.httpService
      .get(`${this.configService.xmlImageUrl}?${searchParams.toString()}`)
      .toPromise();
    const $ = cheerio.load(data);
    const total = Math.ceil(
      Number.parseInt($('posts').attr('count')!, 10) / 21,
    );
    const images = $('post')
      .toArray()
      .map((item) => {
        const {
          rating,
          id,
          file_url,
          width,
          height,
          sample_url,
          sample_width,
          sample_height,
          tags,
          preview_url,
          actual_preview_height,
          actual_preview_width,
        } = (item as cheerio.TagElement).attribs;
        return {
          id,
          url: file_url,
          width,
          height,
          name: last(file_url.split('/')),
          tags,
          sample: sample_url,
          sampleHeight: sample_height,
          sampleWidth: sample_width,
          preview: preview_url,
          previewHeight: actual_preview_height,
          previewWidth: actual_preview_width,
          security: rating === 's',
        };
      })
      .filter(({ security }) => (isSafe ? security : true));
    return {
      total,
      images,
    };
  }
}
