import { glob } from '~common/nodejs/utils';
import { AddonHubsKeys } from '~common/shared/types';
import { hubPatterns } from '~common/shared/utils';
import { directorySearchPattern, createOptionsFromFiles } from '~connectAddon/nodejs/utils';
import { ModToConnect, OptionsByHub } from "~connectAddon/types";


const addGeneratedModOptions = async ({ path }: ModToConnect, optionsByHub: OptionsByHub) => {
    const files = await glob(directorySearchPattern(path), { nodir: true });

    const keys = Object.keys(hubPatterns) as AddonHubsKeys[];

    for (const key of keys) {
        const pattern = hubPatterns[key];

        const generatedHubFiles = files.filter(file => pattern.test(file));

        const newOptions = await createOptionsFromFiles(generatedHubFiles);
        
        optionsByHub[key].push(...newOptions);
    }

    return optionsByHub;
}

const addNonGeneratedModOptions = async ({ path, selectedHub }: ModToConnect, optionsByHub: OptionsByHub) => {
    const files = [path]

    const newOptions = await createOptionsFromFiles(files);
    
    if(selectedHub)
        optionsByHub[selectedHub].push(...newOptions);

    return optionsByHub;
}

export const addModOptions = async (mod: ModToConnect, optionsByHub: OptionsByHub) => {
    const {  isGenerated } = mod;
    
   if(isGenerated) {
        return addGeneratedModOptions(mod, optionsByHub);
    } else {
        return addNonGeneratedModOptions(mod, optionsByHub);
    }
}

