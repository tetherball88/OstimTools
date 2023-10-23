import { EXPLORER_GET_CONFIGS, EXPLORER_GET_META_DATA_FROM_MODS, EXPLORER_GET_SCENES_FOLDER_STRUCTURE, EXPLORER_READ_ALL_SCENES, EXPLORER_READ_SCENE } from "~explorer/events/events";
import { eventsMap } from "~explorer/events/eventsMap";

export const invokeExplorerGetAllConfigs: typeof eventsMap[typeof EXPLORER_GET_CONFIGS] = (...args) => {
    return window.api.invoke(EXPLORER_GET_CONFIGS, ...args);
}

export const invokeExplorerReadScenes: typeof eventsMap[typeof EXPLORER_READ_ALL_SCENES] = () => window.api.invoke(EXPLORER_READ_ALL_SCENES)


export const invokeGetModsMetadata: typeof eventsMap[typeof EXPLORER_GET_META_DATA_FROM_MODS] = (...args) => {
    return window.api.invoke(EXPLORER_GET_META_DATA_FROM_MODS, ...args);
}

export const invokeGetScenesFolderStructure: typeof eventsMap[typeof EXPLORER_GET_SCENES_FOLDER_STRUCTURE] = (...args) => {
    return window.api.invoke(EXPLORER_GET_SCENES_FOLDER_STRUCTURE, ...args);
}

export const invokeReadScene: typeof eventsMap[typeof EXPLORER_READ_SCENE] = (...args) => {
    return window.api.invoke(EXPLORER_READ_SCENE, ...args);
}