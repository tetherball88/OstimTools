import { logger } from "~common/nodejs/utils";
import { checkHkanno, updateAnnotations } from '~bridge/nodejs/utils';
import { checkIfAnimationExcluded } from "~bridge/shared/checkIfAnimationExcluded";
import { isAnimationClimax } from "~bridge/shared/isAnimationClimax";
import { CombinedConfig, OstimConfig } from "~bridge/types";

export const applyAnnotations = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log('--- Started adding annotations')
    const { outputAnimPath } = config
    try {
        const hasHkanno = await checkHkanno(config);

        if(!hasHkanno) {
            logger.log('Can\'t add hkx annotations without properly installed hkanno and its dependencies.');
            logger.log('Your scenes with climax won\'t trigger climax for actors.')
            return;
        }

        for(const [animName, animValue] of Object.entries(ostimConfig)) {
            if(checkIfAnimationExcluded(animName, config)) {
                continue
            }

            const oldAnnotations = ostimConfig[animName].hkxAnnotations
            
            for(const [stageIndex, stage] of animValue.stages.entries()) {
                for(const [actorIndex] of stage.actors.entries()) {
                    try {
                        const fileName = `${animName}_${stageIndex + 1}_${actorIndex}.hkx`
                        const animFilePath = `${outputAnimPath}\\${animValue.folders.posFolderName}\\${animName}\\${fileName}`
                        const oldAnnotationLines = oldAnnotations?.[fileName]?.annotationLines

                        if(oldAnnotationLines) {
                            let addNewContent: string | null = null
                            if(isAnimationClimax(ostimConfig[animName], stageIndex, actorIndex) && !oldAnnotationLines.includes('OStimClimax')) {
                                addNewContent = '1.500000 OStimClimax'
                            }
                            await updateAnnotations(animFilePath, oldAnnotationLines, addNewContent, config)
                        }
                    } catch(e) {
                        logger.warn(e);
                    }
                    
                }
            }
        }
    } catch(e) {
        logger.warn(e.message)
    }

    logger.log('--- Finished adding annotations')

}
