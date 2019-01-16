import { IImage } from '~model/image';

export interface IImageDom extends IImage {
  styleH?: number;
  styleW?: number;
  style?: {
    height: string;
    width: string;
    transform: string;
  };
}
