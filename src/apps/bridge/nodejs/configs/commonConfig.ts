import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { CommonConfig, ModuleSpecificConfig, PackConfig } from "~bridge/types";


export const commonConfig = async (packConfig: PackConfig, module: ModuleSpecificConfig): Promise<CommonConfig> => {
    const modulePath = `${module.module.name}`
    return {
        modulePath,
        scenesJsonConfigFilename: `${packConfig.pack.name}ScenesConfig.json`,
        oldScenesJsonConfigFilename: `${module.module.name}ScenesConfig.json`,
        nemesisTxtFileName: `ATT_${modulePath}_animlist.txt`,
        outputAnimPath: `${packConfig.pack.outputPath}\\meshes\\actors\\character\\animations\\${modulePath}`,
        outputScenePath: `${packConfig.pack.outputPath}\\SKSE\\Plugins\\OStim\\scenes\\${modulePath}`,
        outputNemesisAnimlistTxt: `${packConfig.pack.outputPath}\\meshes\\actors\\character\\Animations\\${modulePath}`,
        outputScenesJsonConfigPath: `${getBridgeConfigPath()}\\ostimConfigs`,
        outputSequencePath: `${packConfig.pack.outputPath}\\SKSE\\Plugins\\OStim\\sequences`,
    }
}