import { Handler } from "~common/events/handlers";
import { getAddonConfigs, writeAddonConfig } from "~connectAddon/nodejs/configs";
import { validateAllHubXmls, validateHubXml } from "~connectAddon/nodejs/configs/validators/validateHubXml";
import { validateSourceModFolder } from "~connectAddon/nodejs/configs/validators/validateSourceModFolderOrFile";
import { connectAddon } from "~connectAddon/nodejs/connectAddon";
import { AddonConfig, AddonHubs } from "~connectAddon/types";

export const handleConnectAddon: Handler<[], void> = () => {
    return connectAddon();
};

export const handleConnectAddonLoadConfigs: Handler<[], AddonConfig> = () => {
    return getAddonConfigs();
};

export const handleConnectAddonWriteConfigs: Handler<[AddonConfig], void> = (event, config) => {
    return writeAddonConfig(config);
};

export const handleValidateAllHubXmls: Handler<[string, AddonHubs], string> = (event, addonHubPath, addonHubs) => {
    return validateAllHubXmls(addonHubPath, addonHubs);
}

export const handleValidateParticularHubXml: Handler<[string, string], string> = (event, hubPath, addonKey) => {
    return validateHubXml(hubPath, addonKey);
}

export const handleValidateSourceModFolderOrFile: Handler<[string, boolean], string> = (event, path, isGenerated) => {
    return validateSourceModFolder(path, isGenerated);
}