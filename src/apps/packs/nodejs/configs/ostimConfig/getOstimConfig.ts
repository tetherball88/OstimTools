import { readJson } from "~common/nodejs/utils";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { OstimConfig } from "~packs/types";


export const getOstimConfig = (moduleName: string): Promise<OstimConfig> => {
    return readJson(`${getPacksConfigPath()}\\ostimConfigs\\${moduleName}ScenesConfig.json`);
}