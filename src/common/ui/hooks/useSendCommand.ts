import { SELECT_DIRECTORY, SELECT_FILE } from "~common/events/events"
import { handleSelectDirectory, handleSelectFile } from "~common/events/handlers"
import { HandlerToInvokeType } from "~common/events/invokers"
import { useMainState } from "~common/ui/state/MainState"
import { CONECT_ADDON_LOAD_CONFIGS, CONECT_ADDON_RUN, CONECT_ADDON_WRITE_CONFIGS } from "~connectAddon/events/events"
import { handleConnectAddon, handleConnectAddonLoadConfigs, handleConnectAddonWriteConfigs } from "~connectAddon/events/handlers"
import { CLEAN_FNIS, CLEAN_HKX, CLEAN_HUBS, CLEAN_MODULE, CLEAN_SCENES, GET_ALL_ANIMATIONS, REMOVE_MODULE, REMOVE_PACK, RUN_ALL, RUN_COPY_FILES, RUN_HUBS, RUN_SCENES, RUN_SCENES_HUBS, WRITE_GLOBAL_CONFIG, WRITE_MODULE_CONFIG, WRITE_PACK_CONFIG, XML_TO_JSON } from "~packs/events/events"
import { handleCleanFnisFiles, handleCleanHkxFiles, handleCleanHubs, handleCleanModule, handleCleanScenes, handleCopyFiles, handleGetAllAnimations, handleRemoveModule, handleRemovePack, handleRunAll, handleSceneHubs, handleWriteGlobalConfig, handleWriteModuleConfig, handleWritePackConfig, handleXmlToJson } from "~packs/events/handlers"

export type MapInvokers = {
    [SELECT_FILE]: HandlerToInvokeType<typeof handleSelectFile>
    [SELECT_DIRECTORY]: HandlerToInvokeType<typeof handleSelectDirectory>
    [REMOVE_PACK]: HandlerToInvokeType<typeof handleRemovePack>
    [WRITE_PACK_CONFIG]: HandlerToInvokeType<typeof handleWritePackConfig>
    [WRITE_MODULE_CONFIG]: HandlerToInvokeType<typeof handleWriteModuleConfig>
    [REMOVE_MODULE]: HandlerToInvokeType<typeof handleRemoveModule>
    [GET_ALL_ANIMATIONS]: HandlerToInvokeType<typeof handleGetAllAnimations>
    [WRITE_GLOBAL_CONFIG]: HandlerToInvokeType<typeof handleWriteGlobalConfig>
    [CONECT_ADDON_LOAD_CONFIGS]: HandlerToInvokeType<typeof handleConnectAddonLoadConfigs>
    [CONECT_ADDON_WRITE_CONFIGS]: HandlerToInvokeType<typeof handleConnectAddonWriteConfigs>
    [CONECT_ADDON_RUN]: HandlerToInvokeType<typeof handleConnectAddon>

    [RUN_ALL]: HandlerToInvokeType<typeof handleRunAll>
    [RUN_SCENES_HUBS]: HandlerToInvokeType<typeof handleSceneHubs>
    [RUN_SCENES]: HandlerToInvokeType<typeof handleSceneHubs>
    [RUN_HUBS]: HandlerToInvokeType<typeof handleSceneHubs>
    [RUN_COPY_FILES]: HandlerToInvokeType<typeof handleCopyFiles>
    [XML_TO_JSON]: HandlerToInvokeType<typeof handleXmlToJson>
    [CLEAN_MODULE]: HandlerToInvokeType<typeof handleCleanModule>
    [CLEAN_HKX]: HandlerToInvokeType<typeof handleCleanHkxFiles>
    [CLEAN_FNIS]: HandlerToInvokeType<typeof handleCleanFnisFiles>
    [CLEAN_SCENES]: HandlerToInvokeType<typeof handleCleanScenes>
    [CLEAN_HUBS]: HandlerToInvokeType<typeof handleCleanHubs>
}

export const useSendCommand = () => {
    const { toggleCommand } = useMainState();

    return async <
        Key extends keyof MapInvokers
    >(
        command: Key, 
        message: string, 
        ...args: Parameters<MapInvokers[Key]>
    ): Promise<ReturnType<MapInvokers[Key]> | null> => {
        try {
            toggleCommand(true, message);
            const res = await window.api.invoke(command, ...args);
            toggleCommand(false, '');
            return res;
        } catch (e) {
            toggleCommand(false, '');
            window.dispatchEvent(new CustomEvent('local-log', {detail: {type: 'error', msg: e.message}}));
            return null;
        }
    }
}