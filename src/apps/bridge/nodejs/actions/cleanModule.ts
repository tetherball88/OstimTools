import { logger, remove } from '~common/nodejs/utils';
import { CombinedConfig, PackFullConfig } from '~bridge/types';
import { getBridgeConfigPath } from '~bridge/nodejs/utils';
import { mergeConfigs } from '~bridge/nodejs/configs';

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

export const cleanNemesisFiles = async ({
    module: {
        name: moduleName,
        nemesisPrefix,
    },
    pack,
}: CombinedConfig) => {
    logger.log(`--- Started cleaning Nemesis files for ${moduleName} ---`)
    remove(`${pack.outputPath}\\Nemesis_Engine\\mod\\${nemesisPrefix}`);
    logger.log(`--- Finished cleaning Nemesis files for ${moduleName} ---`)
}

export const cleanHubsAndScenes = async ({
    outputScenePath,
    module: {
        name: moduleName,
    }
}: CombinedConfig) => {
    logger.log(`--- Started cleaning scenes files for ${moduleName} ---`)
    await remove(outputScenePath);  
    logger.log(`--- Finished cleaning scenes files for ${moduleName} ---`)
}

export const cleanModule = async (config: CombinedConfig) => {
    logger.log(`--- Started cleaning all files for ${config.module.name} ---`)
    await cleanNemesisFiles(config);
    await cleanHkxFiles(config);
    await cleanHubsAndScenes(config);
    logger.log(`--- Finished cleaning all files for ${config.module.name} ---`)
}

export const removeModule = async (config: CombinedConfig) => {
    logger.log(`--- Started removing module ${config.module.name}.`);
    await cleanModule(config);
    await remove(`${getBridgeConfigPath()}\\packsConfigs\\${config.pack.name}\\modules\\${config.module.name}`);
    logger.log(`--- Finished removing module ${config.module.name}.`);
}

export const removePack = async ({modules, ...packSpecificConfig}: PackFullConfig) => {
    logger.log(`--- Started removing module ${packSpecificConfig.pack.name}.`);
    for(const module of modules) {
        await cleanModule(await mergeConfigs(packSpecificConfig, module));
    }
    
    await remove(`${getBridgeConfigPath()}\\packsConfigs\\${packSpecificConfig.pack.name}`);
    logger.log(`--- Finished removing pack ${packSpecificConfig.pack.name}.`);
}