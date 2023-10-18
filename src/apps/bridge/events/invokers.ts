import { LOAD_CONFIGS, LOAD_GLOBAL_CONFIG, VALIDATE_NEMESIS_PATH, VALIDATE_INPUT_PATH, VALIDATE_SLAL_JSON_PATH, LOAD_STARTING_SCENES_CONFIG, SEARCH_STARTING_SCENES } from "~bridge/events/events";
import { eventsMap } from "~bridge/events/eventsMap";


export const invokeLoadConfigs: typeof eventsMap[typeof LOAD_CONFIGS] = () => {
    return window.api.invoke(LOAD_CONFIGS);
}

export const invokeLoadGlobalConfig: typeof eventsMap[typeof LOAD_GLOBAL_CONFIG] = () => {
    return window.api.invoke(LOAD_GLOBAL_CONFIG);
}

export const invokeLoadStartingScenesConfig: typeof eventsMap[typeof LOAD_STARTING_SCENES_CONFIG] = () => {
    return window.api.invoke(LOAD_STARTING_SCENES_CONFIG);
}

export const invokeValidateNemesisPath: typeof eventsMap[typeof VALIDATE_NEMESIS_PATH] = (path) => {
    return window.api.invoke(VALIDATE_NEMESIS_PATH, path);
}

export const invokeValidateInputPath: typeof eventsMap[typeof VALIDATE_INPUT_PATH] = (path) => {
    return window.api.invoke(VALIDATE_INPUT_PATH, path);
}

export const invokeValidateSlalJsonPath: typeof eventsMap[typeof VALIDATE_SLAL_JSON_PATH] = (path) => {
    return window.api.invoke(VALIDATE_SLAL_JSON_PATH, path);
}

export const invokeSearchStartingScenes: typeof eventsMap[typeof SEARCH_STARTING_SCENES] = (path) => {
    return window.api.invoke(SEARCH_STARTING_SCENES, path);
}