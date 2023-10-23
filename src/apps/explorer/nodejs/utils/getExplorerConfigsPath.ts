import { getAppFolderPath } from "~common/nodejs/utils";

export const getExplorerConfigPath = () => {
    return `${getAppFolderPath()}\\configs\\explorer`;
}