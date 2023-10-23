import { remove } from '~common/nodejs/utils';

export const removeScene = async (
    filePath: string
) => {
    await remove(filePath);
}