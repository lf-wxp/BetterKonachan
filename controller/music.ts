import * as path from 'path';
import * as fs from 'fs';

import { EXTRACTPATH } from '~config';
import { IContext } from '~model/context';
import { TFunc1 } from '~type';
import { ISong } from '~model/song';
import { EStateType } from '~model/message';

export const musicList: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    let data: ISong[] = [];
    ctx.type = 'json';
    const jsonPath: string = path.resolve(EXTRACTPATH, 'data.json');
    if (fs.existsSync(jsonPath)) {
        data = JSON.parse(fs.readFileSync(jsonPath).toString());
    }
    ctx.body = {
        state: EStateType.Success,
        msg: 'success',
        data
    };
};
