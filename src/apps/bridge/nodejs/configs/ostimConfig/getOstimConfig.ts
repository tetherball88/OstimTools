import { logger, readJson } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { CombinedConfig, OstimConfig } from "~bridge/types";
import { convertOldOstimConfig } from "~bridge/nodejs/configs/convertOldConfigs/convertOldOstimConfig";
import { validateOstimConfig } from "~common/nodejs/jsonValidators/validateOstimConfig";
import { checkAndRenameOldOstimConfigFilename } from "~bridge/nodejs/configs/convertOldConfigs/renameOldConfigs";


export const getOstimConfig = async (config: CombinedConfig): Promise<OstimConfig> => {
    const filePath = `${getBridgeConfigPath()}\\ostimConfigs\\${config.scenesJsonConfigFilename}`
    await checkAndRenameOldOstimConfigFilename(config)
    let ostimConfig = await readJson(filePath);

    if(!validateOstimConfig(ostimConfig)) {
        try {
            ostimConfig = await convertOldOstimConfig(filePath)
        } catch(e) {
            logger.error(`Your ostim scene config ${config.scenesJsonConfigFilename} is invalid and we tried to convert it to new version but couldn't.`)
            logger.error(e.message)
        }
    }

    return ostimConfig
}