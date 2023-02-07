import { logger, readJson, writeJson } from "~common/nodejs/utils";
import { formatAnimName, getAnimPrefix, getClass, getFurniture, parseSlalName, swapActors } from "~packs/nodejs/utils";
import { CombinedConfig, OstimConfig, OstimConfigAnimation, OstimConfigAnimationActor, OstimConfigAnimationMeta, OstimConfigAnimationStage, ParsedSlalConfig } from "~packs/types";


/**
 * On first time files copy create initial config with some information from slal config(scene tags, animation name, amount of actors with gender)
 * @param param0 
 * @returns 
 */
export const initialOstimConfigOnFileCopy = async ({
    config,
    slalConfig,
    file,
}: {
    config: CombinedConfig
    slalConfig: ParsedSlalConfig
    file: string
}, animationsWithoutSlal: Set<string>, prefix: string) => {
    const {
        scenesJsonConfigFilename,
        outputScenesJsonConfigPath,
        specialSwapRules,
        customScale,
        module: { name: moduleName },
        furnitureMap,
    } = config;
    let ostimConfig: OstimConfig

    try {
        ostimConfig = await readJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`);
    } catch {
        logger.warn(`Wasn't able to find ostim config for animation ${moduleName} module.`);
        ostimConfig = {}
    }
    const parsed = parseSlalName(file);

    if(!parsed) {
        logger.error(`Couldn't build initial ostim config without slal config for file ${file}`)
        return;
    }
    const { id, actorIndex, stageIndex } = parsed;
    const nStageIndex = stageIndex - 1;
    const animName = formatAnimName(id, prefix);

    if(!slalConfig[animName]) {
        animationsWithoutSlal.add(animName);
    }

    const slalSceneConfig = slalConfig[animName];
    const ostimSceneConfig = ostimConfig[animName] = ostimConfig[animName] || {} as OstimConfigAnimation;

    ostimSceneConfig.name = ostimSceneConfig.name || slalSceneConfig?.name || animName;
    ostimSceneConfig.actorsKeyword = ostimSceneConfig.actorsKeyword || slalSceneConfig?.actorsKeyword || 'fm';

    ostimSceneConfig.stages = ostimSceneConfig.stages || [];

    const ostimStageConfig = ostimSceneConfig.stages[nStageIndex] = ostimSceneConfig.stages[nStageIndex] || {} as OstimConfigAnimationStage;
    ostimStageConfig.actors = ostimStageConfig.actors || [];

    const swappedActorIndex = swapActors(actorIndex, ostimSceneConfig, specialSwapRules[animName], nStageIndex);

    const ostimActorConfig = ostimStageConfig.actors[swappedActorIndex] = ostimStageConfig.actors[swappedActorIndex] || {} as OstimConfigAnimationActor;
    
    ostimActorConfig.position = ostimActorConfig.position || swappedActorIndex + '';
    ostimActorConfig.scale = ostimActorConfig.scale || customScale[animName]?.[swappedActorIndex]?.toString() || '1';
    ostimActorConfig.feetOnGround = ostimActorConfig.feetOnGround || 'Replace me!!!';
    ostimActorConfig.tags = ostimActorConfig.tags || '';
    
    ostimActorConfig.gender = ostimActorConfig.gender || slalConfig[animName]?.stages[nStageIndex].actors[actorIndex - 1].gender;

    if(ostimActorConfig.gender === 'male') {
        ostimActorConfig.penisAngle = ostimActorConfig.penisAngle || '0';
    }
    
    ostimStageConfig.meta = ostimStageConfig.meta || {} as OstimConfigAnimationMeta;
    ostimStageConfig.meta.tags = ostimStageConfig.meta.tags || slalSceneConfig?.tags?.toLowerCase() || '';
    ostimStageConfig.meta.furniture = ostimStageConfig.meta.furniture || getFurniture(furnitureMap, animName);

    const posFolderName = `${getAnimPrefix(ostimSceneConfig.actorsKeyword, getFurniture(furnitureMap, animName))}Pos`;
    const classFolderName = getClass(ostimStageConfig);
    ostimStageConfig.id = `${moduleName}|${posFolderName}|${classFolderName}|${animName}-${stageIndex}`;

    const stageFilename = `${moduleName}_${classFolderName}-${animName}_${stageIndex}`
    ostimStageConfig.fileName = stageFilename;

    ostimSceneConfig.folders = {
        moduleName,
        posFolderName,
        classFolderName,
        animName,
    };

    await writeJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`, ostimConfig);

    return { 
        ostimSceneConfig, 
        newAnimFile: `${stageFilename}_${swappedActorIndex}.hkx` 
    };
}