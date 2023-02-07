import { CombinedConfig } from '~packs/types';
import { logger, remove  } from '~common/nodejs/utils';
import { getPacksConfigPath } from '~packs/nodejs/utils';
import { cleanModule } from './cleanModule';

export const removeModule = async (config: CombinedConfig) => {
    logger.log(`--- Started removing module ${config.module.name}.`);
    await cleanModule(config);
    await remove(`${getPacksConfigPath()}\\packsConfigs\\${config.pack.name}\\modules\\${config.module.name}`);
    logger.log(`--- Finished removing module ${config.module.name}.`);
}