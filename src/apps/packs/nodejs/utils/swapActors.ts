import { RecordValueType, SpecialSwapRules, OstimConfigAnimation } from '~packs/types';

/**
 * Slal animation files have different order of actors then osa/ostim
 * It supports to re-arrange actors positions provided by modder in pack config
 * @param index 
 * @param animSlalConfig 
 * @param specialSwapRules 
 * @param stageIndex 
 * @returns 
 */
export function swapActors(index: number, ostimConfig: OstimConfigAnimation, specialSwapRules: RecordValueType<SpecialSwapRules>, stageIndex: number) {
    let slalIndex = index;

    if (ostimConfig.actorsKeyword.length === 1) {
        return 0;
    }

    /**
     * if there special rules how to swap actors from slal use them
     */
    if (specialSwapRules) {
        const newStageIndex = !specialSwapRules.applyToAllStages ? stageIndex : 0;
        const stage = specialSwapRules.stages[newStageIndex];

        if (stage) {
            if (!specialSwapRules.applyToAllStages) {
                return stage[slalIndex - 1];
            } else {
                return stage[slalIndex - 1];
            }
        }
    }

    /**
     * if animation doesn't have male then we can simply decrease each index by 1, so it will start from 0(what osa/ostim expects from us), isntead of starting from 1(slal format)
     */
    if (!ostimConfig?.actorsKeyword.includes('m')) {
        return --slalIndex;
    }

    /**
     * find first male in scene, it will be our 0 index(player) actor
     * it seems that in slal animations female actors always come before male
     * first male will be first actor after particular amount of females in scene
     * we can calculate it from actorsKeyword, like "ffm"
     */
    // const firstMale = animSlalConfig.stages[0].actors.findIndex(({ gender }) => gender === 'male') + 1;
    const firstMale = (ostimConfig?.actorsKeyword.match(new RegExp('f', 'gi')) || []).length + 1;

    if (slalIndex === firstMale) {
        return 0;
    }

    /**
     * if actor are after first male, they need to decrease index by 1
     * otherwise actor can keep their index
     * @example: you have 4 actors in a scene, according to slal they should start from index 1. Assume first male will be with index 3. 
     * We make first actor's index 0, then we retuirn same index for next 2 actors, and for 4th actor we decrease index so he will become index 3.
     * As result we have actors: 0(old 3), 1(old 1), 2(old 2), 3(old 4)
     */
    if (slalIndex > firstMale) {
        return slalIndex - 1;
    }

    return slalIndex;
}