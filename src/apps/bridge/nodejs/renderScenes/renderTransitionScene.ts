import { OstimConfigAnimation, CombinedConfig, AnimationGroup, OstimConfigAnimationStage } from '~bridge/types';
import { OstimScene, OstimSceneAction, OstimSceneActor } from '~bridge/types/OstimSAScene';
import { writeFile } from '~common/nodejs/utils';


/**
 * Render scene config content 
 * @param sceneConfig 
 * @param config 
 * @param stageIndex 
 * @returns 
 */
export const renderTransitionScene = async (sceneConfig: OstimConfigAnimation, config: CombinedConfig, stageIndex: number, hub: AnimationGroup, destination?: string) => {
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
    const stageIndexFromOne = stageIndex + 1;
    const nextStage: OstimConfigAnimationStage | undefined = sceneConfig.stages[stageIndex + 1]
    const hasNextStage = !!sceneConfig.stages[stageIndex + 1]
    const isFirst = stageIndex === 0;

    const actors: OstimSceneActor[] = stageConfig.actors?.map((actor, index) => {
        let autoTransitions: Record<string, string> | null = null
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

    if(!stageConfig.meta.tags?.includes('transition')) {
        stageConfig.meta.tags?.push('transition');
    }

    let durationFromAnnotations = 2.0
    
    actors.forEach((actor, index) => {
        const duration = sceneConfig.hkxAnnotations?.[`${animName}_${stageIndexFromOne}_${index}.hkx`]?.duration
        if(typeof duration === 'number') {
            durationFromAnnotations = duration
        }
    })

    const content: OstimScene = {
        name,
        modpack: `${author}Animations`,
        length: durationFromAnnotations,
        destination: destination || (hasNextStage ? `${animName}-${stageIndexFromOne + 1}` : `${animName}-${stageIndexFromOne - 1}`),
        ...(isFirst ? { 
            origin: hub.name,
            description: sceneConfig.name

        } : {}),
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