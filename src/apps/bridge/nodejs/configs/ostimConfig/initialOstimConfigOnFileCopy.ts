import { logger } from "~common/nodejs/utils";
import { formatAnimName, getAnimPrefix, getFurniture, oldFormatAnimName, parseSlalName, swapActors } from "~bridge/nodejs/utils";
import { CombinedConfig, OstimConfig, OstimConfigAnimation, OstimConfigAnimationMeta, OstimConfigAnimationStage, ParsedSlalConfig } from "~bridge/types";
import { OstimSceneActor } from "~bridge/types/OstimSAScene";


/**
 * On first time files copy create initial config with some information from slal config(scene tags, animation name, amount of actors with gender)
 * @param param0 
 * @returns 
 */
export const initialOstimConfigOnFileCopy = async ({
    config,
    slalConfig,
    file,
    ostimConfig,
}: {
    config: CombinedConfig
    slalConfig: ParsedSlalConfig
    file: string
    ostimConfig: OstimConfig
}, animationsWithoutSlal: Set<string>, prefix: string) => {
    const {
        module: { name: moduleName, idPrefix },
        furnitureMap,
        pack
    } = config;

    const parsed = parseSlalName(file);

    if(!parsed) {
        logger.error(`Couldn't build initial ostim config without slal config for file ${file}`)
        return;
    }
    const { id, actorIndex, stageIndex } = parsed;
    const nStageIndex = stageIndex - 1;
    const animName = formatAnimName(id, prefix, pack.author, idPrefix || "");
    const oldAnimName = oldFormatAnimName(id, prefix)

    if(!slalConfig[animName]) {
        animationsWithoutSlal.add(animName);
    }

    const oldOstimConfig = ostimConfig[oldAnimName]

    if(oldOstimConfig) {
        const newOstimConfig = ostimConfig[animName] = ostimConfig[oldAnimName]
        delete ostimConfig[oldAnimName]
        newOstimConfig.folders.animName = animName
        const hkxAnnoations = newOstimConfig.hkxAnnotations
        
        if(hkxAnnoations) {
            for(const [key, value] of Object.entries(hkxAnnoations)) {
                if(key.startsWith(oldAnimName)) {
                    const newKey = key.replace(oldAnimName, animName);
                    delete hkxAnnoations[key]
                    hkxAnnoations[newKey] = value
                }
            }
        }

        newOstimConfig.stages.forEach(stage => {
            stage.actors.forEach(actor => {
                const transitions = actor.autoTransitions
                if(transitions) {
                    Object.entries(transitions).forEach(([transitionKey, value]) => {
                        if(value?.startsWith(oldAnimName)) {
                            delete transitions[oldAnimName]
                            transitions[transitionKey] = value.replace(oldAnimName, animName);
                        }
                    })
                }
            })
        })
    }

    const slalSceneConfig = slalConfig[animName] || undefined;
    const ostimSceneConfig = ostimConfig[animName] = ostimConfig[animName] || {} as OstimConfigAnimation;

    ostimSceneConfig.name = ostimSceneConfig.name || slalSceneConfig?.name || animName;
    ostimSceneConfig.actorsKeyword = ostimSceneConfig.actorsKeyword || slalSceneConfig?.actorsKeyword || 'fm';

    ostimSceneConfig.stages = ostimSceneConfig.stages || [];

    const ostimStageConfig = ostimSceneConfig.stages[nStageIndex] = ostimSceneConfig.stages[nStageIndex] || {} as OstimConfigAnimationStage;
    ostimStageConfig.actors = ostimStageConfig.actors || [];

    const swappedActorIndex = swapActors(actorIndex, ostimSceneConfig, nStageIndex, slalConfig[animName]);

    const ostimActorConfig = ostimStageConfig.actors[swappedActorIndex] = ostimStageConfig.actors[swappedActorIndex] || {} as OstimSceneActor;
    
    ostimActorConfig.scale = ostimActorConfig.scale || 1;
     
    ostimActorConfig.tags = ostimActorConfig.tags || [];

    ostimActorConfig.feetOnGround = ostimActorConfig.feetOnGround || false;
    
    ostimActorConfig.intendedSex = ostimActorConfig.intendedSex || slalConfig[animName]?.stages[nStageIndex].actors[actorIndex - 1].gender || 'female';

    if(ostimActorConfig.intendedSex === 'male') {
        ostimActorConfig.sosBend = ostimActorConfig.sosBend || 0;
    }

    ostimStageConfig.meta = ostimStageConfig.meta || {} as OstimConfigAnimationMeta;
    ostimStageConfig.meta.tags = ostimStageConfig.meta.tags || slalSceneConfig?.tags?.toLowerCase().split(',') || [];
    ostimStageConfig.meta.furniture = getFurniture(furnitureMap, animName);

    const posFolderName = `${getAnimPrefix(ostimSceneConfig.actorsKeyword, getFurniture(furnitureMap, animName))}Pos`;
    ostimStageConfig.id = `${animName}-${stageIndex}`;

    const stageFilename = `${animName}_${stageIndex}`
    ostimStageConfig.fileName = stageFilename;

    ostimSceneConfig.folders = {
        moduleName,
        posFolderName,
        animName,
    };

    return { 
        ostimSceneConfig, 
        newAnimFile: `${stageFilename}_${swappedActorIndex}.hkx` 
    };
}