import { glob, logger, writeJson } from "~common/nodejs/utils"
import { checkHkanno, parseAnimationPath } from "~bridge/nodejs/utils"
import { readAnnotations } from "~bridge/nodejs/utils/workWithAnnotation"
import { CombinedConfig, OstimConfig } from "~bridge/types"
import { shouldAnalyzeAnnotations } from "~bridge/nodejs/utils/shouldAnalyzeAnnotations"
import { checkIfAnimationExcluded } from "~bridge/shared/checkIfAnimationExcluded"

export const analyzeAnimations = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    const files = await glob(`${config.outputAnimPath}\\**\\*.hkx`);
    const { transitions } = config

    try {
        const hasHkanno = await checkHkanno(config);

        if(!hasHkanno) {
            logger.log('Can\'t add hkx annotations without properly installed hkanno and its dependencies.');
            logger.log('Your scenes with climax won\'t trigger climax for actors.')
            return;
        }

        for(const file of files) {
            const { fileName, animName } = parseAnimationPath(file);
            const [actorIndexStr, stageIndexStr] = fileName.replace('.hkx', '').split('_').reverse()
            const isCustomTransition = !!transitions?.find(({ sceneId }) => sceneId === `${animName}-${stageIndexStr}`)

            if(
                (!shouldAnalyzeAnnotations(ostimConfig[animName], Number(stageIndexStr) - 1, Number(actorIndexStr)) && !isCustomTransition)
                || !!ostimConfig[animName].hkxAnnotations?.[fileName]
                || checkIfAnimationExcluded(animName, config)
            ) {
                continue
            }

            const annotations = await readAnnotations(file, config);

            const hkxAnnotations = ostimConfig[animName].hkxAnnotations = ostimConfig[animName].hkxAnnotations || {}
            hkxAnnotations[fileName] = annotations
        }
        await writeJson(`${config.outputScenesJsonConfigPath}\\${config.scenesJsonConfigFilename}`, ostimConfig)
    } catch(e: any) {
        logger.warn(e.message)
    }
}