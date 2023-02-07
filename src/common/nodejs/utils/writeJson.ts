import { writeFile } from './writeFile';

export const writeJson = async (jsonFilePath: string, content: any) => {
    return writeFile(jsonFilePath, JSON.stringify(content, null, 4));
}