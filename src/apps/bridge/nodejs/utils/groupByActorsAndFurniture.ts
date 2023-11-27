import { getStartingScenesConfig } from '~bridge/nodejs/configs/startingScenes';
import { getAnimPrefix, getHubName } from '~bridge/nodejs/utils/utils';
import { OstimConfig, AnimationGroup, CombinedConfig, FurnitureTypes } from '~bridge/types';
import { StartingScenesConfig } from '~bridge/types/StartingScenes';
import { logger } from '~common/nodejs/utils';

const noStandingActors = <T extends { tags?: string[] }>(actors: T[]) => {
    return !actors.some(({ tags }) => tags?.includes('standing'))
}

const findBedCompatibleStartingScenes = (scenes: StartingScenesConfig, actorsKeyword: string) => {
    return scenes.scenes.filter(({ actors, actorsKeyword: sceneActorsKeyword }) => {
        return noStandingActors(actors) && actorsKeyword === sceneActorsKeyword
    })
}

const findHubOrigin = async (actorsKeyword: string, furniture?: FurnitureTypes) => {
    const startingScenes = await getStartingScenesConfig()
    let potentialOrigins = startingScenes.scenes.filter((origin) => {
        let fit = origin.actorsKeyword === actorsKeyword

        if(furniture) {
            fit = fit && furniture === origin.furniture
        }

        if(furniture === "chair" && fit) {
            console.log(origin, fit, actorsKeyword)
        }

        return fit
    })

    if(furniture === 'bed') {
        potentialOrigins = findBedCompatibleStartingScenes(startingScenes, actorsKeyword)
    }

    if(!potentialOrigins.length) {
        logger.warn(`Couldn't find any Ostim starter scenes which would fit this actors combination ${actorsKeyword.toUpperCase()} ${furniture ? ` and furniture: ${furniture}` : ''}.`)
        logger.warn(`Add more sources for starting scenes.`)
    }

    return (potentialOrigins.find(origin => origin.name.toLowerCase().includes('standing')) || potentialOrigins[0])
}

const animationsPerPage = 11

function divideListIntoSublists<T>(list: T[], itemsPerSublist: number) {
    const sublists = [];
    for (let i = 0; i < list.length; i += itemsPerSublist) {
      sublists.push(list.slice(i, i + itemsPerSublist));
    }
    return sublists;
}

/**
 * Group animations by set of actors(fm, ffm, ff, fmm, etc...) and type of furniture they are interacting with
 * @param config 
 * @param ostimConfig 
 * @returns 
 */
export const groupByActorsAndFurniture = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    const groups: Record<string, AnimationGroup> = {};
    const scenesConfigs = Object.values(ostimConfig);
    const hubsWithoutOrigins: Record<string, boolean> = {}

    for (const sceneConfig of scenesConfigs) {
        const { actorsKeyword } = sceneConfig;
        const furniture = sceneConfig.stages[0].meta.furniture;

        const hubName = getHubName(config, actorsKeyword, furniture);

        const hub = groups[hubName] = groups[hubName] || {} as AnimationGroup;

        hub.name = hub.name || hubName;
        hub.furniture = hub.furniture || furniture;
        
        hub.origin = await findHubOrigin(actorsKeyword, furniture)

        if(!hub.origin) {
            hubsWithoutOrigins[hub.name] = true;
            delete groups[hubName];
            continue
        }

        hub.folderName = getAnimPrefix(actorsKeyword, furniture)

        hub.animations = hub.animations || [];
        hub.animations.push(sceneConfig);
    }

    if(Object.keys(hubsWithoutOrigins).length) {
        logger.warn(`--- couldn't find any origin for these hubs: ${Object.keys(hubsWithoutOrigins).join(', ')}`);
    }

    for(const [, hub] of Object.entries(groups)) {
        const pages = divideListIntoSublists(hub.animations, animationsPerPage);

        if(pages.length > 1) {
            hub.animations = []
            for(const [pageIndex, animationsList] of pages.entries()) {
                const folderName = `${hub.folderName}\\page${pageIndex + 1}`;
                const pageHub: AnimationGroup = {
                    name: `${config.module.name}Page${pageIndex + 1}`,
                    folderName,
                    animations: animationsList,
                    origin: {
                        ...hub.origin,
                        name: hub.name,
                    }
                }
                hub.animations.push(pageHub)
            }
        }
    }

    return Object.values(groups);
}