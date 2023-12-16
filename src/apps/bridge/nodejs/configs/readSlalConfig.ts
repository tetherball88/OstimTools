import { logger, readJson } from "~common/nodejs/utils";
import { formatAnimName, parseSlalName } from "~bridge/nodejs/utils";
import { CombinedConfig, ParsedSlalConfig, ParsedSlalConfigAnimation, SlalConfig } from "~bridge/types";
import { readObjects } from "~bridge/nodejs/configs/readObjects/readObjects";


/**
 * read and map slal json config
 * @param slalJsonConfig 
 * @param prefix 
 * @returns 
 */
export const readSlalConfig = async (config: CombinedConfig, prefix: string) => {
    const {
        module: {
            slalJsonConfig,
            idPrefix = ""
        },
        pack: {
            author
        }
    } = config
    if (!slalJsonConfig) {
        logger.warn('No slal config path was provided.')
        return;
    }
    
    const objects = await readObjects(config, prefix);

    return (await readJson(slalJsonConfig) as SlalConfig).animations.reduce<ParsedSlalConfig>((acc, animConfig) => {
        let { id } = animConfig;
        id = formatAnimName(id, prefix, author, idPrefix);

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

                const actorObjects = objects?.[id]?.[actorIndex]

                currentStage.actors[actorIndex].objects = actorObjects?.[0]?.stage === 'all' ? actorObjects[0] : actorObjects?.find(obj => obj?.stage === stageIndex);
            });
        });

        acc[id].actorsKeyword = 'f'.repeat(f) + 'm'.repeat(m);

        return acc;
    }, {});
}
