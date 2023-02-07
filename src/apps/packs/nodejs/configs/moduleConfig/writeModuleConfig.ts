import { logger, writeYaml } from "~common/nodejs/utils";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { ModuleSections, ModuleSpecificConfig } from "~packs/types";


export const writeModuleConfig = async (packName: string, moduleContent: ModuleSpecificConfig) => {
    logger.log(`--- Start writing to pack ${packName} config for ${moduleContent.module.name} module`);

    for (const moduleSection in moduleContent) {
        await writeYaml(
            `${getPacksConfigPath()}\\packsConfigs\\${packName}\\modules\\${moduleContent.module.name}\\${moduleSection}.yml`,
            { [moduleSection]: moduleContent[(moduleSection as ModuleSections)] }
        );
    }
    logger.log(`--- Finished writing to pack ${packName} config for ${moduleContent.module.name} module`);
}

