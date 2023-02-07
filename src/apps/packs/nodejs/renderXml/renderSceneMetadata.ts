
import { OstimConfigAnimationStage } from '~packs/types';
import { renderAttrs } from "./renderAttrs"

/**
 * If scene is either climax or intro, we don't want ostim to pick it in auto mode
 * @param stageConfig 
 * @returns 
 */
const noRandomSelection = (stageConfig: OstimConfigAnimationStage) => {
    return stageConfig.actors.some(({tags}) => tags?.includes('climaxing')) || stageConfig.meta.tags.includes('intro') || stageConfig.meta.tags.includes('idle');
}

/**
 * Render scene's metadata tag
 * @param stageConfig 
 * @returns 
 */
export const renderSceneMetadata = (stageConfig: OstimConfigAnimationStage) => {
    if(noRandomSelection(stageConfig)) {
        stageConfig.meta.noRandomSelection = '1'
    }
    const attrsStr = renderAttrs(stageConfig.meta);
    if(!attrsStr) {
        return '';
    }

    return `<metadata ${attrsStr}/>`
}