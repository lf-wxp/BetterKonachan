import { IContext } from '~model/context';
import { TFunc1 } from '~type';

// tslint:disable export-name
export const index: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    await ctx.render('index');
};
