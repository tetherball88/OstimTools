import { glob, logger, writeJson } from "~common/nodejs/utils";
import { checkHkanno, parseAnimationPath, updateAnnotations } from '~bridge/nodejs/utils';
import { checkIfAnimationExcluded } from "~bridge/shared/checkIfAnimationExcluded";
import { isAnimationClimax } from "~bridge/shared/isAnimationClimax";
import { CombinedConfig, OstimConfig } from "~bridge/types";

export const applyAnnotations = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log('--- Started adding annotations')
    const { outputAnimPath, outputScenesJsonConfigPath, scenesJsonConfigFilename } = config
    const files = await glob(`${config.outputAnimPath}\\**\\*.hkx`);
    const visited: Record<string, boolean> = {}
    
    try {
        const hasHkanno = await checkHkanno(config);

        if(!hasHkanno) {
            logger.log('Can\'t add hkx annotations without properly installed hkanno and its dependencies.');
            logger.log('Your scenes with climax won\'t trigger climax for actors.')
            return;
        }

        for(const file of files) {
            const { animName } = parseAnimationPath(file);
    
            if(checkIfAnimationExcluded(animName, config) || visited[animName]) {
                continue
            }

            visited[animName] = true

            const animConfig = ostimConfig[animName]
            const oldAnnotations = animConfig.hkxAnnotations

            for(const [stageIndex, stage] of animConfig.stages.entries()) {
                for(const [actorIndex] of stage.actors.entries()) {
                    try {
                        const fileName = `${animName}_${stageIndex + 1}_${actorIndex}.hkx`
                        const animFilePath = `${outputAnimPath}\\${animConfig.folders.posFolderName}\\${animName}\\${fileName}`
                        const oldFileAnnotations = oldAnnotations?.[fileName]

                        if(oldFileAnnotations) {
                            let addNewContent: string | null = null
                            if(isAnimationClimax(ostimConfig[animName], stageIndex, actorIndex) && !oldFileAnnotations.annotationLines?.includes('OStimClimax')) {
                                addNewContent = '1.500000 OStimClimax'
                            }
                            const newAnnotationLines = await updateAnnotations(animFilePath, oldFileAnnotations.annotationLines, addNewContent, config)

                            oldFileAnnotations.annotationLines = newAnnotationLines;
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

    await writeJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`, ostimConfig);

    logger.log('--- Finished adding annotations')

}
