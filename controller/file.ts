import fs from 'fs';
import path from 'path';
import { mkdirsSync, extractFile } from '~util';
import { UPLOADPATH, EXTRACTPATH } from '~config';

import { EFileState } from '~model/uploadMsg';
import { IMsg, EStateType } from '~model/message';
import { IContext } from '~model/context';
import { IZipFile } from '~model/zipFile';
import { TFunc1, TFuncVoid } from '~type';

let currenUploadFile: string = '';
export const fileInit: TFuncVoid = (): void => {
    if (!fs.existsSync(UPLOADPATH)) {
        mkdirsSync(UPLOADPATH);
    }

    if (!fs.existsSync(EXTRACTPATH)) {
        mkdirsSync(EXTRACTPATH);
    }
};

export const fileList: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const result: string[] = fs.readdirSync(UPLOADPATH);
    ctx.body = {
        state: EStateType.Success,
        msg: 'query file list successfully',
        data: result
    };
};

export const fileExtract: TFunc1<IContext, Promise<void>> = async (
    ctx: IContext
): Promise<void> => {
    const { name }: IZipFile = <IZipFile>ctx.request.body;
    const newPath: string = path.resolve(UPLOADPATH, name);
    if (fs.existsSync(newPath)) {
        const data: IMsg = await extractFile(newPath, EXTRACTPATH);
        ctx.body = data;
    } else {
        ctx.body = {
            state: EStateType.Fail,
            msg: 'file is not exist'
        };
    }
};

export const fileUpload: TFunc1<IContext, void> = (ctx: IContext): void => {
    ctx.websocket.on('message', (message: string) => {
        if (typeof message === 'string') {
            if (message === '') {
                ctx.websocket.send(
                    JSON.stringify({
                        state: EFileState.Complete,
                        data: 'upload file successfully'
                    })
                );
            } else {
                ctx.websocket.send(
                    JSON.stringify({ state: EFileState.Created })
                );
            }
            currenUploadFile = message;
        } else {
            try {
                fs.appendFileSync(
                    path.resolve(UPLOADPATH, currenUploadFile),
                    message
                );
                ctx.websocket.send(
                    JSON.stringify({ state: EFileState.ChunkAdded })
                );
            } catch (error) {
                ctx.websocket.send(
                    JSON.stringify({ state: EFileState.Fail, data: error })
                );
            }
        }
    });
};
