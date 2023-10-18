import { readYaml, writeYaml } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { GlobalConfig } from "~bridge/types";

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
    const path = `${getBridgeConfigPath()}\\global.yml`
    try {
        return await readYaml(path);
    } catch {
        const initialConfig: GlobalConfig = {
            nemesisTransitionToolExe: ''
        }
        await writeYaml(path, initialConfig);
        return initialConfig;
    }
    
}