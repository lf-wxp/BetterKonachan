import { Image } from '~module/image';

import { IContext } from '~model/context';
import { IImage } from '~model/image';
import { TFunc1 } from '~util';
import { EStateType } from '~model/message';

export const imageTotalPage: TFunc1<void, Promise<number>> = async (): Promise<
    number
> => {
    return Image.getPage();
};

export const imageList: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const imgs: IImage[] = await Image.getData(ctx.query);
    const totalPage: number = await Image.getPage();
    ctx.body = {
        state: EStateType.Success,
        msg: 'success',
        data: {
            images: imgs,
            pages: totalPage
        }
    };
};
