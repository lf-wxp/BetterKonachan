import PicData from '@module/image';

import { IContext } from '@model/context';

const totalPage: number = 0;

export const imageTotalPage = async (): Promise<number> => {
  return PicData.getPage();
};

export const imageList = async (ctx: IContext): Promise<void> => {
  const imgs = await PicData.getData(ctx.query);
  ctx.body = {
      images: imgs,
      pages: totalPage,
  };
};
