import fs from 'fs';
import path from 'path';
import { rimraf } from 'rimraf'

export const removeParentFoldersIfEmpty = async (pathName: string) => {
    const dirname = path.dirname(pathName);
    if (!(await fs.promises.readdir(dirname)).length) {
        await fs.promises.rm(dirname, { recursive: true, force: true });
        await removeParentFoldersIfEmpty(dirname);
    }
}

export const removeFileOrFolder = async (pathName: string) => {
    try {
        await rimraf(pathName, {
            preserveRoot: false
        });
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(error.message);
            return;
        }
    }
}
