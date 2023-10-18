import { logger, writeJson } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { StartingScenesConfig } from "~bridge/types/StartingScenes";

export const writeStartingScenesConfig = async (config: StartingScenesConfig) => {
    logger.log(`--- Start writing to startingScenes config`);

    await writeJson(`${getBridgeConfigPath()}\\startingScenes.json`, config);

    logger.log(`--- Finished writing to startingScenes config`);
}

