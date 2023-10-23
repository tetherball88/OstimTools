import fs from 'fs';
import path from 'path';
import { writeFile } from '~common/nodejs/utils/writeFile';

export const createFileOrFolder = async (pathName: string) => {
    const extname = path.extname(pathName);

    if(extname) {
        await writeFile(pathName, '')
    } else {
        await fs.promises.mkdir(pathName, { recursive: true });
    }
}