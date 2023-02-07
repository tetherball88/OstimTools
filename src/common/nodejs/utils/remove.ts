import fs from 'fs';

export const remove = async (path: string) => {
    try {
        const res = await fs.promises.rm(path, { recursive: true, force: true });
        return res;
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(error.message);
            return;
        }
    }
}