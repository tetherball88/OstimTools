import { glob, isHkxFile, logger } from '~common/nodejs/utils';
import { groupByActorsAndFurniture, parseAnimationPath } from "~bridge/nodejs/utils";
import { 
    renderHubsAndScenes,
} from "~bridge/nodejs/renderScenes";
import { cleanHubsAndScenes } from "./cleanModule";
import { OstimConfig, CombinedConfig } from '~bridge/types';
import { getOstimConfig } from "../configs";
import { groupModuleHubsForSameOrigin } from '~bridge/nodejs/utils/groupModuleHubsForSameOrigin';

const generateHubsAndScenesFiles = async (files: string[], config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log('--- Started generating hub files.');
    const filterOstimConfig: OstimConfig = {}
    const visited: Record<string, boolean> = {}

    for (const file of files) {
        if(!isHkxFile(file)) {
            continue;
        }

        const { animName } = parseAnimationPath(file);

        if(visited[animName]) {
            continue
        }

        visited[animName] = true

        filterOstimConfig[animName] = ostimConfig[animName]
    }
    
    const animsGroups = await groupByActorsAndFurniture(config, filterOstimConfig);

    await renderHubsAndScenes(animsGroups, config)
}

export const makeOstimScenes = async (config: CombinedConfig) => {
    logger.log('--- Started generating scene files.');
    const {
        outputAnimPath,
        outputScenesJsonConfigPath,
        scenesJsonConfigFilename
    } = config;

    let ostimConfig: OstimConfig

    try {
        ostimConfig = await getOstimConfig(config);
    } catch (e) {
        logger.error(`Couldn't load ostim config file ${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename} \n ${e.toString()}`)
        logger.log('Please run copy hkx files, this tool will create initial ostim config file.')
        return;
    }

    const files = await glob(`${outputAnimPath}\\**\\*.hkx`);

    if (!files) {
        logger.error('--- Couldn\'t find any hkx file in provided outputPath. Please make sure that you ran "copy hkx" button.');
        logger.log('--- Stopped generating scenes files.');
        return;
    }

    await cleanHubsAndScenes(config);
    await generateHubsAndScenesFiles(files, config, ostimConfig);
    await groupModuleHubsForSameOrigin(config);

    logger.log('--- Finished generating scene files.');
}