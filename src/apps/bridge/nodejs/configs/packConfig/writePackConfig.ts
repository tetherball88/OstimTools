import { logger, writeYaml } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { PackConfig } from "~bridge/types";


export const writePackConfig = async (packContent: PackConfig) => {
    logger.log(`--- Start writing config for ${packContent.pack.name} pack`);

    await writeYaml(`${getBridgeConfigPath()}\\packsConfigs\\${packContent.pack.name}\\pack.yml`, packContent);

    logger.log(`--- Finished writing config for ${packContent.pack.name} pack`);
}
