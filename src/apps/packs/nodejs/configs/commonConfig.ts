import { hubPathToId } from "~common/shared/utils";
import { getAddonConfigs } from "~connectAddon/nodejs/configs";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { CommonConfig, ModuleSpecificConfig, PackConfig } from "~packs/types";


export const commonConfig = async (packConfig: PackConfig, module: ModuleSpecificConfig): Promise<CommonConfig> => {
    const addonHubConfig = await getAddonConfigs()
    const addonHubIds = hubPathToId(addonHubConfig.addonHubs);

    return {
        get overwriteTweakedAnimationsPath() {
            if (!packConfig.pack.tweakedAnimationFilesPath) {
                return '';
            }
            return `${packConfig.pack.tweakedAnimationFilesPath}\\${module.module.name}`;
        },
        scenesJsonConfigFilename: `${module.module.name}ScenesConfig.json`,
        fnisTxtFileName: `FNIS_0Sex_${module.module.name}_List.txt`,
        fnisHkxFileName: `FNIS_0Sex_${module.module.name}_Behavior.hkx`,
        outputAnimPath: `${packConfig.pack.outputPath}\\meshes\\0SA\\mod\\0Sex\\anim\\${module.module.name}`,
        outputScenePath: `${packConfig.pack.outputPath}\\meshes\\0SA\\mod\\0Sex\\scene\\${module.module.name}`,
        outputHubScenePath: `${packConfig.pack.outputPath}\\meshes\\0SA\\mod\\0Sex\\scene\\${module.module.name}\\Hubs\\Hubs`,
        outputFnisBehaviorTxt: `${packConfig.pack.outputPath}\\meshes\\actors\\character\\Animations\\0Sex_${module.module.name}`,
        outputFnisBehaviorHkx: `${packConfig.pack.outputPath}\\meshes\\actors\\character\\Behaviors`,
        hubIdPath: `${module.module.name}|Hubs|Hubs|`,
        outputScenesJsonConfigPath: `${getPacksConfigPath()}\\ostimConfigs`,
        backToAddonHub: {
            fm: addonHubIds.main,
            fmChair: addonHubIds.chair,
            fmBench: addonHubIds.bench,
            fmTable: addonHubIds.table,
            fmWall: addonHubIds.wall,
            fmBed: addonHubIds.main,
        }
    }
}