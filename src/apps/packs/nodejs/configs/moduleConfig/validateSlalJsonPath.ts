import { readJson } from "~common/nodejs/utils";
import { getSlalPrefix } from "~packs/nodejs/utils";


export const validateSlalJsonPath = async (slalPath: string) => {
    try {
        const slalJson = await readJson(slalPath);
        
        if(!slalJson.animations) {
            return 'SLAL json config is invalid, please check that you provided path to correct slal json file';
        }

        try {
            getSlalPrefix(slalPath)
        } catch {
            return 'Couldn\'t find SLAL source txt file, please make sure it\'s within SLAL pack folder.'
        }

        return '';
    } catch {
        return 'Couldn\'t find SLAL json config file with provided path';
    }
}