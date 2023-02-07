import { Handler } from "~common/events/handlers";
import { cleanFnisFiles, cleanHkxFiles, cleanHubs, cleanModule, cleanScenes, copyAnimationsWithRename, generateSceneJsonConfigFromXml, makeScenesXml, removeModule, removePack } from "~packs/nodejs";
import { getAllPacksConfigs, getGlobalConfig, mergeConfigs, validateFnisPath, validateInputPath, validateSlalJsonPath, writeGlobalConfig, writeModuleConfig, writePackConfig } from "~packs/nodejs/configs";
import { readAllAnimationsFromInputPath } from "~packs/nodejs/readAllAnimationsFromInputPath";
import { getSlalPrefix } from "~packs/nodejs/utils";
import { AnimationFromModule, CombinedConfig, GlobalConfig, ModuleSpecificConfig, PackConfig, PackFullConfig } from "~packs/types";

export const handleRunAll: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    await cleanModule(combinedConfig);
    await copyAnimationsWithRename(combinedConfig);
    return makeScenesXml(combinedConfig);
};

export const handleCopyFiles: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return copyAnimationsWithRename(combinedConfig);
}

export const handleSceneHubs: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return makeScenesXml(combinedConfig);
}

export const handleScenes: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return makeScenesXml(combinedConfig, true);
}

export const handleHubs: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return makeScenesXml(combinedConfig, false, true);
}

export const handleXmlToJson: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return generateSceneJsonConfigFromXml(combinedConfig);
}

export const handleCleanModule: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return cleanModule(combinedConfig);
}

export const handleCleanHkxFiles: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return cleanHkxFiles(combinedConfig);
}

export const handleCleanFnisFiles: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return cleanFnisFiles(combinedConfig);
}

export const handleCleanScenes: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return cleanScenes(combinedConfig);
}

export const handleCleanHubs: Handler<[PackFullConfig, ModuleSpecificConfig], void> = async (event, { modules, ...otherPackConfig }, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    return cleanHubs(combinedConfig);
}

export const handleRemoveModule: Handler<[PackConfig, ModuleSpecificConfig], void> = async (event, packConfig, moduleConfig) => {
    const combinedConfig: CombinedConfig = await mergeConfigs(packConfig, moduleConfig);
    return removeModule(combinedConfig);
}

export const handleRemovePack: Handler<[PackFullConfig], void> = (event, config) => {
    return removePack(config);
}

export const handleLoadConfigs: Handler<[], Record<string, PackFullConfig>> = async () => {
    return getAllPacksConfigs();
}

export const handleLoadGlobalConfig: Handler<[], GlobalConfig> = async () => {
    try {
        const res = await getGlobalConfig();
        return res;
    } catch(e) {
        console.error(e);
        return { fnisForModdersPath: '' };
    }
}

export const handleGetAllAnimations: Handler<[string, string], AnimationFromModule> = async (event, inputPath, slalJsonConfig) => {
    const prefix = await getSlalPrefix(slalJsonConfig);

    if(typeof prefix === 'undefined') {
        return {};
    }

    const res = await readAllAnimationsFromInputPath(inputPath, prefix);
    return res || {};
}

export const handleWritePackConfig: Handler<[PackConfig], void> = (event, config) => {
    return writePackConfig(config);
}

export const handleWriteModuleConfig: Handler<[string, ModuleSpecificConfig], void> = (event, packName, config) => {
    return writeModuleConfig(packName, config);
}

export const handleWriteGlobalConfig: Handler<[GlobalConfig], void> = (event, config) => {
    return writeGlobalConfig(config);
}

export const handleValidateFnisPath: Handler<[string], string> = (event, fnisPath) => {
    return validateFnisPath(fnisPath);
}

export const handleValidateInputPath: Handler<[string], boolean> = (event, inputPath) => {
    return validateInputPath(inputPath);
}

export const handleValidateSlalJsonPath: Handler<[string], string> = (event, slalJsonPath) => {
    return validateSlalJsonPath(slalJsonPath);
}