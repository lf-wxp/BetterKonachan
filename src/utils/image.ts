import { catchError, map, pluck, switchMap, tap } from 'rxjs/operators';
import { of, zip, Observable } from 'rxjs';

import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import querystring from 'querystring';
// import { retryWithDelay } from 'rxjs-retry-delay';

interface ImageDetail {
  id: string;
  sampleWidth: number;
  sampleHeight: number;
  sample: string;
  previewWidth: number;
  previewHeight: number;
  preview: string;
  url: string;
  width: number;
  height: number;
  security: boolean;
  name: string;
  tags: string;
}

interface ImageResData {
  pages: number;
  images: ImageDetail[];
}

const IMAGEPAGESIZE = 21;
const IMAGEURLXML = 'http://konachan.net/post.xml';

export const parseXmlData = (xmlData: string): ImageResData => {
  const $ = cheerio.load(xmlData);
  const pages = Math.floor(
    Number.parseInt($('posts').attr('count')!, 10) / IMAGEPAGESIZE,
  );
  const images: ImageDetail[] = [];
  $('post').map((__, post) => {
    const attrs = post.attribs;
    images.push({
      id: attrs.id,
      url: attrs.file_url,
      sampleWidth: Number.parseInt(attrs.sample_width, 10),
      sampleHeight: Number.parseInt(attrs.sample_height, 10),
      sample: attrs.sample_url,
      preview: attrs.preview_url,
      previewWidth: Number.parseInt(attrs.actual_preview_width, 10),
      previewHeight: Number.parseInt(attrs.actual_preview_height, 10),
      width: Number.parseInt(attrs.width, 10),
      height: Number.parseInt(attrs.height, 10),
      tags: attrs.tags,
      security: attrs.rating === 's',
      name: `${attrs.md5}${path.extname(attrs.file_url)}`,
    });
  });

  return {
    pages,
    images,
  };
};

export const imageXmlObservable = ({
  page = 1,
  tags = '',
}: {
  page: number | string;
  tags: string;
}): Observable<ImageResData> => {
  const params$ = of<{ page: number | string; tags: string }>({ page, tags });
  const url$ = of<string>(IMAGEURLXML);
  return zip(params$, url$).pipe(
    tap(() => console.log('image post')),
    switchMap(([{ page, tags }, url]) =>
      axios.get(`${url}?${querystring.stringify({ page, tags })}`),
    ),
    pluck('data'),
    map((xmlData: string) => parseXmlData(xmlData)),
    // retryWithDelay({
    //   delay: 1000,
    //   scalingFactor: 2,
    //   maxRetryAttempts: 4,
    // }),
    catchError(() => {
      return of({
        images: [],
        pages: -1,
      });
    }),
  );
};
