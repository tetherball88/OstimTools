import { getBridgeConfigPath } from "~bridge/nodejs/utils"
import fs from 'fs'
import { CombinedConfig } from "~bridge/types";
import { logger } from "~common/nodejs/utils";

export const renameOldConfigsFolder = async () => {
    const bridgePath = getBridgeConfigPath()
    const oldPath = bridgePath.replace('bridge', 'packs');

    if(!fs.existsSync(bridgePath)) {
        fs.promises.rename(oldPath, bridgePath)
    }
}

export const checkAndRenameOldOstimConfigFilename = async (config: CombinedConfig) => {
    const oldPath = `${getBridgeConfigPath()}\\ostimConfigs\\${config.oldScenesJsonConfigFilename}`
    const newPath = `${getBridgeConfigPath()}\\ostimConfigs\\${config.scenesJsonConfigFilename}`
    try {
        if(fs.existsSync(oldPath)) {
            await fs.promises.rename(oldPath, newPath);
        }
    } catch(e) {
        logger.error(e)
    }

}