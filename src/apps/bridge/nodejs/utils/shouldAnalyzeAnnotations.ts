import { isAnimationClimax } from "~bridge/shared/isAnimationClimax"
import { OstimConfigAnimation } from "~bridge/types"

export const shouldAnalyzeAnnotations = (ostimAnimationConfig: OstimConfigAnimation, stageIndex: number, actorIndex: number) => {
    return isAnimationClimax(ostimAnimationConfig, stageIndex, actorIndex) 
    || ostimAnimationConfig.stages[stageIndex].meta.tags?.includes('annotation')
    || ostimAnimationConfig.stages[stageIndex].actors[actorIndex].tags?.includes('annotation')
}