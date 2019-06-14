import { IImage } from '~model/image';
import { IDownload } from '~cModel/download';

export interface ICtx {
  bgUri: string;
  items: IImage[];
  pages: number;
  page: number;
  security: boolean;
  expand: boolean;
  download: IDownload[];
  loading: boolean;
}
