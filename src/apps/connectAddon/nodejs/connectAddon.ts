import { logger, readXml, writeXml } from "~common/nodejs/utils";
import { AddonHubsKeys } from "~common/shared/types";
import { defaultHubPaths, hubPatterns, osaFolderScenePath } from "~common/shared/utils";
import { getAddonConfigs } from "~connectAddon/nodejs/configs";
import { addModOptions } from "~connectAddon/nodejs/utils";
import { OptionsByHub } from "~connectAddon/types";


export const connectAddon = async () => {
    logger.log(`--- Started connecting mods to Addon Hub`);
    const config = await getAddonConfigs();

    const keys = Object.keys(hubPatterns) as AddonHubsKeys[];

    let optionsByHub: OptionsByHub = {
        bench: [],
        chair: [],
        wall: [],
        main: [],
        table: [],
    }
    
    for(const mod of config.modsToConnect) {
        optionsByHub = await addModOptions(mod, optionsByHub);
    }

    for (const key of keys) {
        const { main: { addonHubPath, outputPath, prependNewOptions }, addonHubs } = config;
        const filePath = addonHubs[key] || defaultHubPaths[key];

        const addonHubXmlRelativeFilePath = `${osaFolderScenePath}\\${filePath}`;
        const addonHubXmlObj = await readXml(`${addonHubPath}\\${addonHubXmlRelativeFilePath}`);

        const currentOptions = [...addonHubXmlObj.scene.nav[0].tab[1].page[0].option];

        const newOptions = optionsByHub[key];
        /**
         * get "Return" option and keep it at first position
         */
        let mergedOptions = [currentOptions.shift()];

        if (prependNewOptions) {
            mergedOptions = mergedOptions.concat(newOptions, currentOptions);
        } else {
            mergedOptions = mergedOptions.concat(currentOptions, newOptions);
        }

        addonHubXmlObj.scene.nav[0].tab[1].page[0].option = mergedOptions;

        const targetFilePath = `${outputPath}\\${addonHubXmlRelativeFilePath}`;

        await writeXml(targetFilePath, addonHubXmlObj);
    }

    logger.log(`--- Finished connecting mods to Addon Hub`);
}
