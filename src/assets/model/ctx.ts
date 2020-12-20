import { ImageDetail } from './image';
import { ColorSet } from './colorSet';

export interface Ctx {
  items: ImageDetail[];
  pages: number;
  page: number;
  security: boolean;
  loading: boolean;
  colorSet: ColorSet;
  tags: string;
}
