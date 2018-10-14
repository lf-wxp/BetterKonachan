import { Image } from '~module/Image';

import { IContext } from '~model/context';
import { IImage } from '~model/image';
import { TFunc1 } from '~type';

const totalPage: number = 0;

export const imageTotalPage: TFunc1<void, Promise<number>> = async (): Promise<number> => {
    return Image.getPage();
};

export const imageList: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const imgs: IImage[] = await Image.getData(ctx.query);
    ctx.body = {
        images: imgs,
        pages: totalPage
    };
};
