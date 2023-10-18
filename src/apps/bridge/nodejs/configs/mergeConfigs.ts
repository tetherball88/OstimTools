import { commonConfig } from "~bridge/nodejs/configs/commonConfig";
import { getGlobalConfig } from "~bridge/nodejs/configs/globalConfig";
import { CombinedConfig, ModuleSpecificConfig, PackConfig } from "~bridge/types";

export const mergeConfigs = async (packConfig: PackConfig, moduleConfig: ModuleSpecificConfig): Promise<CombinedConfig> => {
    const global = await getGlobalConfig();
    const common = await commonConfig(packConfig, moduleConfig)
    return {
        ...packConfig,
        ...moduleConfig,
        ...common,
        global,
    }
}