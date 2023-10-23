import { readFile } from './readFile';

export const readJson = async (filePath: string) => {
    const content = await readFile(filePath)
    return JSON.parse(content || 'null');
}
