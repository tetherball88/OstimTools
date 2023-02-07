import { logger, writeYaml } from "~common/nodejs/utils";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { GlobalConfig } from "~packs/types";

export const writeGlobalConfig = async (globalConfig: GlobalConfig) => {
    logger.log(`--- Start writing to global config`);

    await writeYaml(`${getPacksConfigPath()}\\global.yml`, globalConfig);

    logger.log(`--- Finished writing to global config`);
}

