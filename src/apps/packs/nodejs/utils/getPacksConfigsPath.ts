import { getAppFolderPath } from "~common/nodejs/utils";

export const getPacksConfigPath = () => {
    return `${getAppFolderPath()}\\configs\\packs`;
}