import { logger, remove } from '~common/nodejs/utils';
import { CombinedConfig } from '~packs/types';

export const cleanHkxFiles = async ({
    outputAnimPath,
    module: {
        name: moduleName,
    }
}: CombinedConfig) => {
    logger.log(`--- Started cleaning .hkx files for ${moduleName} ---`)
    await remove(outputAnimPath);
    logger.log(`--- Finished cleaning .hkx files for ${moduleName} ---`)
}

export const cleanFnisFiles = async ({
    outputFnisBehaviorHkx,
    fnisHkxFileName,
    outputFnisBehaviorTxt,
    fnisTxtFileName,
    module: {
        name: moduleName,
    }
}: CombinedConfig) => {
    logger.log(`--- Started cleaning FNIS files for ${moduleName} ---`)
    await remove(`${outputFnisBehaviorHkx}\\${fnisHkxFileName}`);  
    await remove(`${outputFnisBehaviorTxt}\\${fnisTxtFileName}`);  
    logger.log(`--- Finished cleaning FNIS files for ${moduleName} ---`)
}

export const cleanScenes = async ({
    outputScenePath,
    module: {
        name: moduleName,
    }
}: CombinedConfig) => {
    logger.log(`--- Started cleaning Scenes files for ${moduleName} ---`)
    await remove(outputScenePath);  
    logger.log(`--- Finished cleaning Scenes files for ${moduleName} ---`)
}

export const cleanHubs = async ({
    outputHubScenePath,
    module: {
        name: moduleName,
    }
}: CombinedConfig) => {
    logger.log(`--- Started cleaning Hubs files for ${moduleName} ---`)
    await remove(outputHubScenePath);  
    logger.log(`--- Finished cleaning Hubs files for ${moduleName} ---`)
}

export const cleanModule = async (config: CombinedConfig) => {
    logger.log(`--- Started cleaning all files for ${config.module.name} ---`)
    await cleanFnisFiles(config);
    await cleanHkxFiles(config);
    await cleanScenes(config);
    await cleanHubs(config);
    logger.log(`--- Finished cleaning all files for ${config.module.name} ---`)
}