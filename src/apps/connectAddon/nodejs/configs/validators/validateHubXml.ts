import { readFile } from '~common/nodejs/utils';
import { AddonHubsKeys } from '~common/shared/types';
import { osaFolderScenePath } from '~common/shared/utils';
import { getAddonConfigs } from '~connectAddon/nodejs/configs/getAddonConfig';
import { AddonHubs } from '~connectAddon/types';

export const validateHubXml = async (hubPath: string, addonHubPath?: string) => {
    addonHubPath = addonHubPath || (await getAddonConfigs()).main.addonHubPath;
    try {
        await readFile(`${addonHubPath}\\${osaFolderScenePath}\\${hubPath}`);
        return '';
    } catch {
        return `Couldn't find xml file for this hub.`;
    }
}

export const validateAllHubXmls = async (path: string, hubs: AddonHubs) => {
    const config = await getAddonConfigs();
    config.main.addonHubPath = path;
    config.addonHubs = hubs.addonHubs;
    try {
        const keys: AddonHubsKeys[] = Object.keys(config.addonHubs) as AddonHubsKeys[];

        for(const key of keys) {
            const res = await validateHubXml(config.addonHubs[key], path);

            if(res) {
                throw '';
            }
        }
        
        return ''
    } catch {
        return 'Couldn\'t find one or more hub files in the provided Opensex Addon Hub.';
    }
}