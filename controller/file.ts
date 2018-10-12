import * as fs from 'fs';
import * as path from 'path';
import { mkdirsSync, extractFile } from '@util';
import { UPLOADPATH, EXTRACTPATH } from '@config';

import { IContext } from '@model/context';
import { IZipFile } from '@model/zipFile';


let currenUploadFile: string = '';
export const fileInit = (): void => {
    if (!fs.existsSync(UPLOADPATH)) {
        mkdirsSync(UPLOADPATH);
    }

    if (!fs.existsSync(EXTRACTPATH)) {
        mkdirsSync(EXTRACTPATH);
    }
};

export const fileList = async (ctx: IContext): Promise<void> => {
    const result: string[] = fs.readdirSync(UPLOADPATH);
    ctx.body = result;
};

export const fileExtract = async (ctx: IContext): Promise<void> => {
    const { name }: IZipFile = ctx.request.body as IZipFile;
    const newPath: string = path.resolve(UPLOADPATH, name);
    if (fs.existsSync(newPath)) {
        const data = await extractFile(newPath, EXTRACTPATH);
        ctx.body = data;
    } else {
        ctx.body = {
            type: 'fail',
            msg: 'file is not exist',
        };
    }
};

export const fileUpload = (ctx: IContext): void => {
  ctx.websocket.on('message', (message) => {
      if (typeof message === 'string') {
          if (currenUploadFile) {
              ctx.websocket.send(
                  JSON.stringify({
                      type: 'success',
                  }),
              );
          } else {
              ctx.websocket.send(JSON.stringify({ type: 'notice'}));
          }
          currenUploadFile = message;
      } else {
          try {
              fs.appendFileSync(path.resolve(UPLOADPATH, currenUploadFile), message);
              ctx.websocket.send(JSON.stringify({ type: 'notice'}));
          } catch (error) {
              ctx.websocket.send(JSON.stringify({ type: 'error', data: error }));
          }
      }
  });
};
