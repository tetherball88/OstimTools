import { CombinedConfig, OstimConfig } from "~bridge/types";
import { writeJson } from "~common/nodejs/utils";

export const writeOstimConfig = async ({outputScenesJsonConfigPath, scenesJsonConfigFilename}: CombinedConfig, ostimConfig: OstimConfig) => {
    return await writeJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`, ostimConfig);
}