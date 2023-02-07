import { logger, writeYaml } from "~common/nodejs/utils";
import { getConnectAddonConfigsPath } from "~connectAddon/nodejs/utils";
import { AddonConfig } from "~connectAddon/types";

export const writeAddonConfig = async (config: AddonConfig) => {
    logger.log(`--- Start writing addon hub config `);
    const configPath = `${getConnectAddonConfigsPath()}\\config.yml`;

    await writeYaml(configPath, config);

    logger.log(`--- Finished writing addon hub config `);
}
