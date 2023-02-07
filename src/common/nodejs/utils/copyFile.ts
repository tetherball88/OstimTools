import fs from 'fs';
import path from 'path';

export const copyFile = async (src: string, dest: string) => {
    const dir = path.dirname(dest);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.copyFile(src, dest);
}