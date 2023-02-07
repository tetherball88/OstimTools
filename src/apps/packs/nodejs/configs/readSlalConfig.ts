import { logger, readJson } from "~common/nodejs/utils";
import { formatAnimName, parseSlalName } from "~packs/nodejs/utils";
import { ParsedSlalConfig, ParsedSlalConfigAnimation, SlalConfig } from "~packs/types";


/**
 * read and map slal json config
 * @param slalJsonConfig 
 * @param prefix 
 * @returns 
 */
export const readSlalConfig = async (slalJsonConfig: string, prefix: string) => {
    if (!slalJsonConfig) {
        logger.warn('No slal config path was provided.')
        return;
    }

    return (await readJson(slalJsonConfig) as SlalConfig).animations.reduce<ParsedSlalConfig>((acc, animConfig) => {
        let { id } = animConfig;
        id = formatAnimName(id, prefix);

        acc[id] = acc[id] || {} as ParsedSlalConfigAnimation;
        acc[id].tags = animConfig.tags;
        acc[id].name = animConfig.name;

        acc[id].stages = acc[id].stages || [];
        let f = 0;
        let m = 0;

        animConfig.actors.forEach((actor, actorIndex) => {
            if (actor.type.toLowerCase() === 'female') {
                f++;
            } else {
                m++;
            }
            actor.stages.forEach(stage => {
                const parsedSlalId = parseSlalName(stage.id);

                if (!parsedSlalId) {
                    logger.error(`Couldn't parse slal id: ${stage.id}`)
                    return;
                }

                const { stageIndex } = parsedSlalId
                const currentStage = acc[id].stages[stageIndex - 1] = acc[id].stages[stageIndex - 1] || {} as ParsedSlalConfigAnimation['stages'][0];
                currentStage.actors = currentStage.actors || [];

                currentStage.actors[actorIndex] = currentStage.actors[actorIndex] || {} as ParsedSlalConfigAnimation['stages'][0]['actors'][0];

                currentStage.actors[actorIndex].gender = actor.type.toLowerCase() as 'male' | 'female';

                if (currentStage.actors[actorIndex].gender === 'male' && stage.sos) {
                    currentStage.actors[actorIndex].penisAngle = stage.sos;
                }
            });
        });

        acc[id].actorsKeyword = 'f'.repeat(f) + 'm'.repeat(m);

        return acc;
    }, {});
}
