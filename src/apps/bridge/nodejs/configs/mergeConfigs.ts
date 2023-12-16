import { commonConfig } from "~bridge/nodejs/configs/commonConfig";
import { getGlobalConfig } from "~bridge/nodejs/configs/globalConfig";
import { OstimAlignmentJson } from "~bridge/nodejs/utils/checkAlignmentJson";
import { CombinedConfig, ModuleSpecificConfig, PackConfig } from "~bridge/types";
import { logger, readJson } from "~common/nodejs/utils";

export const mergeConfigs = async (packConfig: PackConfig, moduleConfig: ModuleSpecificConfig): Promise<CombinedConfig> => {
    const global = await getGlobalConfig();
    const common = await commonConfig(packConfig, moduleConfig)
    let alignment: OstimAlignmentJson | null = null

    try {
        if(global.ostimAlignmentJsonPath) {
            alignment = await readJson(global.ostimAlignmentJsonPath) as OstimAlignmentJson
        }    
    } catch(e) {
        logger.warn('You don\'t have alignment.json file. It will skip looking into for positional alignments')
    }
    
    
    return {
        ...packConfig,
        ...moduleConfig,
        ...common,
        global,
        alignment,
    }
}