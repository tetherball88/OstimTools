import { OstimConfigAnimation, CombinedConfig, AnimationGroup, OstimConfigAnimationStage } from '~bridge/types';
import { OstimScene, OstimSceneAction, OstimSceneActor, OstimSceneNavigation } from '~bridge/types/OstimSAScene';
import { writeFile } from '~common/nodejs/utils';
import { isSceneClimax } from '~bridge/shared/isAnimationClimax';


/**
 * Render scene config content 
 * @param sceneConfig 
 * @param config 
 * @param stageIndex 
 * @returns 
 */
export const renderScene = async (sceneConfig: OstimConfigAnimation, config: CombinedConfig, stageIndex: number, hub: AnimationGroup) => {
    const {
        name,
        folders: {
            animName
        }
    } = sceneConfig;
    const {
        pack: { author },
        outputScenePath,
    } = config
    const stageConfig = sceneConfig.stages[stageIndex];
    const isLast = stageIndex === sceneConfig.stages.length - 1;
    const isFirst = stageIndex === 0;
    const stageIndexFromOne = stageIndex + 1;
    const nextStage: OstimConfigAnimationStage | undefined = sceneConfig.stages[stageIndex + 1]
    const isPrevStageClimax = isSceneClimax(sceneConfig, stageIndex-1)
    
    const navigations: OstimSceneNavigation[] = []

    if(isFirst) {
        navigations.push({
            origin: hub.name,
            description: sceneConfig.name,
            icon: 'OStim/symbols/gender_mf',
        })
    }

    const nextHasClimax = isSceneClimax(sceneConfig, stageIndex + 1)

    if(!isLast) {
        navigations.push({
            destination: `${animName}-${stageIndexFromOne + 1}`,
            description: nextHasClimax? 'Next(climax)' : 'Next',
            icon: 'OStim/symbols/arrow_right',
        })
    }

    if(!isFirst) {
        let prevSceneStageIndex = stageIndexFromOne - 1
        if(isPrevStageClimax) {
            prevSceneStageIndex = stageIndexFromOne - 2
        }
        navigations.push({
            destination: `${animName}-${prevSceneStageIndex}`,
            description: 'Back',
            icon: 'OStim/symbols/arrow_left',
        })
    }

    navigations.push({
        destination: hub.name,
        description: 'Return',
        icon: 'OStim/symbols/return',
    })

    const actors: OstimSceneActor[] = stageConfig.actors?.map((actor, index) => {
        let autoTransitions: Record<string, string> | null = actor.autoTransitions || null
        const actorFromNextStage = nextStage?.actors[index]
        if(actorFromNextStage?.tags?.includes('climaxing')) {
            autoTransitions = { climax: `${animName}-${stageIndexFromOne + 1}` }
        }
        return {
            intendedSex: actor?.intendedSex,
            ...(typeof actor?.sosBend === 'number' ? { sosBend: actor?.sosBend } : {}),
            scale: actor?.scale,
            feetOnGround: actor.feetOnGround,
            ...(actor.expressionOverride ? { expressionOverride: actor.expressionOverride } : {}),
            tags: actor?.tags,
            ...(autoTransitions ? { autoTransitions } : {}),
        }
    })

    const actions: OstimSceneAction[] = stageConfig.actions?.map(action => {
        return {
            type: action.type,
            ...(typeof action.actor !== 'undefined' ? { actor: Number(action.actor) } : {}),
            ...(typeof action.target !== 'undefined' ? { target: Number(action.target) } : {}),
            ...(typeof action.performer !== 'undefined' ? { performer: Number(action.performer) } : {}),
        }
    }) || []

    const content: OstimScene = {
        name,
        modpack: `${author}Animations`,
        length: 2.0,
        navigations,
        speeds: [
            {
                animation: stageConfig.fileName,
            }
        ],
        actors,
        actions,
        ...(stageConfig.noRandomSelection ? { noRandomSelection: true } : {}),
        ...(stageConfig.meta.tags ? {tags: stageConfig.meta.tags} : {}),
        ...(hub.furniture ? { furniture: hub.furniture } : {})
    }

    const newScene = stageConfig.id
    const newSceneFile = `${newScene}.json`;

    await writeFile(`${outputScenePath}\\${hub.folderName}\\${sceneConfig.folders.animName}\\${newSceneFile}`, JSON.stringify(content, undefined, 4));
}