import { HandlerToInvokeType } from "~common/events/invokers";
import { LOAD_CONFIGS, LOAD_GLOBAL_CONFIG, VALIDATE_FNIS_PATH, VALIDATE_INPUT_PATH, VALIDATE_SLAL_JSON_PATH } from "~packs/events/events";
import { handleLoadConfigs, handleLoadGlobalConfig, handleValidateFnisPath, handleValidateInputPath, handleValidateSlalJsonPath } from "~packs/events/handlers";


export const invokeLoadConfigs: HandlerToInvokeType<typeof handleLoadConfigs> = () => {
    return window.api.invoke(LOAD_CONFIGS);
}

export const invokeLoadGlobalConfig: HandlerToInvokeType<typeof handleLoadGlobalConfig> = () => {
    return window.api.invoke(LOAD_GLOBAL_CONFIG);
}

export const invokeValidateFnisPath: HandlerToInvokeType<typeof handleValidateFnisPath> = (path) => {
    return window.api.invoke(VALIDATE_FNIS_PATH, path);
}

export const invokeValidateInputPath: HandlerToInvokeType<typeof handleValidateInputPath> = (path) => {
    return window.api.invoke(VALIDATE_INPUT_PATH, path);
}

export const invokeValidateSlalJsonPath: HandlerToInvokeType<typeof handleValidateSlalJsonPath> = (path) => {
    return window.api.invoke(VALIDATE_SLAL_JSON_PATH, path);
}