import { IContext } from '@model/context';

export const index = async (ctx: IContext): Promise<void> => {
  await ctx.render('index');
};
