import { logger, writeYaml } from "~common/nodejs/utils";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { PackConfig } from "~packs/types";


export const writePackConfig = async (packContent: PackConfig) => {
    logger.log(`--- Start writing config for ${packContent.pack.name} pack`);

    await writeYaml(`${getPacksConfigPath()}\\packsConfigs\\${packContent.pack.name}\\pack.yml`, packContent);

    logger.log(`--- Finished writing config for ${packContent.pack.name} pack`);
}
