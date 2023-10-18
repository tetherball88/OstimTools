import { logger, writeYaml } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { GlobalConfig } from "~bridge/types";

export const writeGlobalConfig = async (globalConfig: GlobalConfig) => {
    logger.log(`--- Start writing to global config`);

    await writeYaml(`${getBridgeConfigPath()}\\global.yml`, globalConfig);

    logger.log(`--- Finished writing to global config`);
}

