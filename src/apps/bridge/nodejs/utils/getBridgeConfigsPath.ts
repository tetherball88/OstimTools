import { getAppFolderPath } from "~common/nodejs/utils";

export const getBridgeConfigPath = () => {
    return `${getAppFolderPath()}\\configs\\bridge`;
}