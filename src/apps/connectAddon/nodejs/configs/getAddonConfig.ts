import { readYaml, writeYaml } from "~common/nodejs/utils";
import { AddonHubsKeys } from "~common/shared/types";
import { defaultHubPaths } from "~common/shared/utils";
import { getConnectAddonConfigsPath } from "~connectAddon/nodejs/utils";
import { AddonConfig } from "~connectAddon/types";

export const getAddonConfigs = async (): Promise<AddonConfig> => {
    const configPath = `${getConnectAddonConfigsPath()}\\config.yml`;

    try {
        const config = await readYaml(configPath) as AddonConfig

        Object.keys(config.addonHubs).forEach((key: AddonHubsKeys) => {
            if (!config.addonHubs[key]) {
                config.addonHubs[key] = defaultHubPaths[key]
            }
        });

        return config;
    } catch {
        const initialConfig: AddonConfig = {
            main: {
                addonHubPath: '',
                outputPath: '', 
                prependNewOptions: true
            },
            modsToConnect: [],
            addonHubs: defaultHubPaths,
        }
        await writeYaml(configPath, initialConfig);

        return initialConfig;
    }
}
