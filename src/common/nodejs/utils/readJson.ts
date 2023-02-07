import { readFile } from './readFile';

export const readJson = async (filePath: string) => {
    return JSON.parse(await readFile(filePath));
}