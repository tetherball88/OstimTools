import { HandlerToInvokeType } from "~common/events/invokers";
import { CONECT_ADDON_LOAD_CONFIGS, CONECT_ADDON_RUN, CONECT_ADDON_WRITE_CONFIGS, VALIDATE_ALL_ADDON_HUB_XML, VALIDATE_PARTICULAR_ADDON_HUB_XML, VALIDATE_SOURCE_MOD_FOLDER_OR_FILE } from "~connectAddon/events/events";
import { handleConnectAddon, handleConnectAddonLoadConfigs, handleConnectAddonWriteConfigs, handleValidateAllHubXmls, handleValidateParticularHubXml, handleValidateSourceModFolderOrFile } from "~connectAddon/events/handlers";


export const invokeConnectAddon: HandlerToInvokeType<typeof handleConnectAddon> = () => {
    return window.api.invoke(CONECT_ADDON_RUN);
}

export const invokeConnectAddonLoadConfigs: HandlerToInvokeType<typeof handleConnectAddonLoadConfigs> = () => {
    return window.api.invoke(CONECT_ADDON_LOAD_CONFIGS);
}

export const invokeConnectAddonWriteConfigs: HandlerToInvokeType<typeof handleConnectAddonWriteConfigs> = () => {
    return window.api.invoke(CONECT_ADDON_WRITE_CONFIGS);
}

export const invokeValidateAllHubXmls: HandlerToInvokeType<typeof handleValidateAllHubXmls> = (...args) => {
    return window.api.invoke(VALIDATE_ALL_ADDON_HUB_XML, ...args);
}

export const invokeValidateParticularHubXml: HandlerToInvokeType<typeof handleValidateParticularHubXml> = (...args) => {
    return window.api.invoke(VALIDATE_PARTICULAR_ADDON_HUB_XML, ...args);
}

export const invokeValidateSourceModFolderOrFile: HandlerToInvokeType<typeof handleValidateSourceModFolderOrFile> = (path, isGenerated) => {
    return window.api.invoke(VALIDATE_SOURCE_MOD_FOLDER_OR_FILE, path, isGenerated);
}


