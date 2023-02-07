import fs from 'fs';
import path from 'path';

export const writeFile = async (filePath: string, content: string) => {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    return fs.promises.writeFile(filePath, content);
}