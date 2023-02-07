import fs from 'fs';

export const readFile = async (filePath: string) => {
    const res = await fs.promises.readFile(filePath, { encoding: 'utf8' });
    return res;
}