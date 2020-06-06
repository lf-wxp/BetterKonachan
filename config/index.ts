import { resolve } from 'path';

const BASEPATH: string = resolve(__dirname, '../');

export const UPLOADPATH: string = resolve(BASEPATH, 'upload');
export const EXTRACTPATH: string = resolve(BASEPATH, 'assets/dist/media');

export const IMAGEURLXML: string = 'http://konachan.net/post.xml';
export const IMAGEURLJSON: string = 'http://konachan.net/post.json';
export const IMAGEPAGESIZE: number = 21;

export const SONGDOWNLOADURL: string =
    'http://music.163.com/song/media/outer/url?id=';
export const SONGLISTURL: string = 'http://music.163.com/api/playlist/detail';

export const PORT: number = 8888;

export const USERID: number = 95815468;
