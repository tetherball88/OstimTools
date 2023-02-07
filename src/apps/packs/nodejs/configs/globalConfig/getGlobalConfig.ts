import { readYaml, writeYaml } from "~common/nodejs/utils";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { GlobalConfig } from "~packs/types";

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
    const path = `${getPacksConfigPath()}\\global.yml`
    try {
        return await readYaml(path);
    } catch {
        const initialConfig: GlobalConfig = {
            fnisForModdersPath: ''
        }
        await writeYaml(path, initialConfig);
        return initialConfig;
    }
    
}