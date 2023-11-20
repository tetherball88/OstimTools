import { OstimConfigAnimation, OstimConfigAnimationStage } from "~bridge/types";

export const isAnimationClimax = (animConfig: OstimConfigAnimation, stageIndex: number, actorIndex: number) => {
    const prevStage: OstimConfigAnimationStage | undefined = animConfig.stages[stageIndex-1];
    const currentStage: OstimConfigAnimationStage | undefined = animConfig.stages[stageIndex]

    return !!prevStage?.actors[actorIndex].autoTransitions?.climax || !!currentStage?.actors[actorIndex].tags?.includes('climaxing');
}

export const isSceneClimax = (animConfig: OstimConfigAnimation, stageIndex: number) => {
    const stage: OstimConfigAnimationStage | undefined = animConfig.stages[stageIndex]

    for(const [actorIndex] of (stage?.actors || []).entries()) {
        if(isAnimationClimax(animConfig, stageIndex, actorIndex)) {
            return true;
        }
    }

    return false
}

export const isSceneTransition = (animConfig: OstimConfigAnimation, stageIndex: number) => {
    if(stageIndex < 0) {
        return false
    }
    
    const stage: OstimConfigAnimationStage | undefined = animConfig.stages[stageIndex]

    return stage.meta.tags?.includes('transition')
}