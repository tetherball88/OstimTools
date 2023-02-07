import { PackFullConfig } from '~packs/types';
import { logger, remove  } from '~common/nodejs/utils';
import { getPacksConfigPath } from '~packs/nodejs/utils';
import { mergeConfigs } from './configs';
import { cleanModule } from './cleanModule';

export const removePack = async ({modules, ...packSpecificConfig}: PackFullConfig) => {
    logger.log(`--- Started removing module ${packSpecificConfig.pack.name}.`);
    for(const module of modules) {
        await cleanModule(await mergeConfigs(packSpecificConfig, module));
    }
    
    await remove(`${getPacksConfigPath()}\\packsConfigs\\${packSpecificConfig.pack.name}`);
    logger.log(`--- Finished removing pack ${packSpecificConfig.pack.name}.`);
}