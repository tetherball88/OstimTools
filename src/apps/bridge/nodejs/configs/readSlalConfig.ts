import { logger, readJson } from "~common/nodejs/utils";
import { readObjectsFromSource } from "~bridge/nodejs/configs/readObjectsFromSource";
import { formatAnimName, parseSlalName } from "~bridge/nodejs/utils";
import { ParsedSlalConfig, ParsedSlalConfigAnimation, SlalConfig } from "~bridge/types";


/**
 * read and map slal json config
 * @param slalJsonConfig 
 * @param prefix 
 * @returns 
 */
export const readSlalConfig = async (slalJsonConfig: string, prefix: string, author: string, inputPath: string) => {
    if (!slalJsonConfig) {
        logger.warn('No slal config path was provided.')
        return;
    }
    
    const objects = await readObjectsFromSource(slalJsonConfig, prefix, author, inputPath);

    return (await readJson(slalJsonConfig) as SlalConfig).animations.reduce<ParsedSlalConfig>((acc, animConfig) => {
        let { id } = animConfig;
        id = formatAnimName(id, prefix, author);

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

                const actorObjects = objects[id]?.[actorIndex]

                currentStage.actors[actorIndex].objects = actorObjects?.[0].stage === 'all' ? actorObjects[0] : actorObjects?.find(obj => obj.stage === stageIndex);
            });
        });

        acc[id].actorsKeyword = 'f'.repeat(f) + 'm'.repeat(m);

        return acc;
    }, {});
}
