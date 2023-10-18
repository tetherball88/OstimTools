import { readJson, writeJson } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { StartingScenesConfig } from "~bridge/types/StartingScenes";

export const getStartingScenesConfig = async (): Promise<StartingScenesConfig> => {
    const path = `${getBridgeConfigPath()}\\startingScenes.json`
    try {
        return await readJson(path);
    } catch {
        const initialConfig: StartingScenesConfig = {
            sources: [],
            scenes: []
        }
        await writeJson(path, initialConfig);
        return initialConfig;
    }
    
}
