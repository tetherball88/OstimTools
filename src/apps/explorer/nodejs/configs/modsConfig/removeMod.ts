import { removeFileOrFolder } from '~common/nodejs/utils/removeFileOrFolder';
import { getExplorerConfigPath } from '~explorer/nodejs/utils';

export const removeMod = async (modId: string) => {
    const modConfigPath = `${getExplorerConfigPath()}\\mods\\${modId}`;
    return await removeFileOrFolder(modConfigPath)
}