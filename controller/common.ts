import { IContext } from '~model/context';
import { TFunc1 } from '~util';

export const index: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    await ctx.render('index');
};
