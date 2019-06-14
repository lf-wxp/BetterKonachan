import { IImage } from '~model/image';
import { CSSProperties } from 'react';

export interface IImageDom extends IImage {
  styleH?: number;
  styleW?: number;
  style?: CSSProperties;
  full?: boolean;
}
