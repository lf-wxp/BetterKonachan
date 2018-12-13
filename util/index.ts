import * as extract from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';

import { IMsg, EStateType } from '~model/message';
import { TFunc1Void } from '~type';

export function removeAllFile(dir: string): void {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
        .forEach((file: string) => {
            const curPath: string = path.resolve(dir, file);
            if (fs.statSync(curPath)
            .isDirectory()) {
                // recurse
                removeAllFile(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
}

export function extractFile(
    dirpath: string,
    extractPath: string
): Promise<IMsg> {
    return new Promise((resolve: TFunc1Void<IMsg>, reject: TFunc1Void<IMsg>): void => {
        removeAllFile(extractPath);
        extract(
            dirpath,
            {
                dir: extractPath
            },
            (err: Error) => {
                const data: IMsg = {
                    state: EStateType.Success,
                    msg: 'extract success'
                };
                if (err) {
                    data.state = EStateType.Success;
                    data.msg = 'extract fail';
                    reject(data);
                } else {
                    resolve(data);
                    fs.unlinkSync(dirpath);
                }
            }
        );
    });
}

export function deleteFolderRecursive(dir: string): void {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
        .forEach((file: string): void => {
            const curPath: string = `${dir}/${file}`;
            if (fs.statSync(curPath)
            .isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

export function mkdirsSync(dirname: string): boolean | void {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);

            return true;
        }
    }
}
