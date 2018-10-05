import { IContext } from '@model/context';

export const index = async (ctx: IContext) => {
  await ctx.render('index');
};
