import { OstimConfigAnimation, ParsedSlalConfigAnimation } from '~bridge/types';

/**
 * Slal animation files have different order of actors then osa/ostim
 * It supports to re-arrange actors positions provided by modder in pack config
 * @param index 
 * @param animSlalConfig 
 * @param specialSwapRules 
 * @param stageIndex 
 * @returns 
 */
export function swapActors(slalIndex: number, ostimConfig: OstimConfigAnimation, stageIndex: number, animSlalConfig: ParsedSlalConfigAnimation) {
    if (!animSlalConfig) {
        return slalIndex - 1
    }

    if (ostimConfig.actorsKeyword.length === 1) {
        return 0;
    }

    /**
     * if animation doesn't have mix gender then we can simply decrease each index by 1, so it will start from 0(what osa/ostim expects from us), isntead of starting from 1(slal format)
     */
    if (!(ostimConfig?.actorsKeyword.includes('m') && ostimConfig?.actorsKeyword.includes('f'))) {
        return --slalIndex;
    }

    (animSlalConfig.stages[stageIndex].actors[slalIndex-1] as any).oldIndex = slalIndex

    const sortedMales = [...animSlalConfig.stages[stageIndex].actors].sort((a, b) => {
        if (a.gender !== b.gender) {
            if (a.gender === 'male') {
                return -1
            } else {
                return 1
            }
        }

        return 0;
    })

    const newIndex = sortedMales.findIndex(actor => (actor as any).oldIndex === slalIndex);

    return newIndex;
}