import * as path from 'path';
import * as fs from 'fs';

import { EXTRACTPATH } from '@config';
import { IContext } from '@model/context';

export const musicList = async (ctx: IContext): Promise<void> => {
  ctx.type = 'json';
  const data: Buffer = fs.readFileSync(path.resolve(EXTRACTPATH, 'data.json'));
  ctx.body = data;
};
