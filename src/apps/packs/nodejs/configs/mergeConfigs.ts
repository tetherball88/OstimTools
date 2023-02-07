import { commonConfig } from "~packs/nodejs/configs/commonConfig";
import { getGlobalConfig } from "~packs/nodejs/configs/globalConfig";
import { CombinedConfig, ModuleSpecificConfig, PackConfig } from "~packs/types";

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