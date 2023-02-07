import { getAppFolderPath } from "~common/nodejs/utils";

export const getConnectAddonConfigsPath = () => {
    return `${getAppFolderPath()}\\configs\\connectAddon`;
}