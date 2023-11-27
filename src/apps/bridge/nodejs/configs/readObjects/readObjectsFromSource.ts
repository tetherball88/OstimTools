
import path from 'path'
import { AnimObjects, AnimObjectsActor } from '~bridge/nodejs/configs/readObjects/AnimObjects';
import { readObjectsFromBehavior } from '~bridge/nodejs/configs/readObjects/readObjectsFromBehavior';
import { formatAnimName } from '~bridge/nodejs/utils';
import { CombinedConfig } from '~bridge/types';
import { getFileName, logger, readFile } from '~common/nodejs/utils';

export const readObjectsFromSource = async function(config: CombinedConfig, prefix: string) {
    const {
        module: {
            slalJsonConfig: slalJsonPath,
            idPrefix = ""
        },
        pack: {
            author
        }
    } = config
    const slalJsonName = getFileName(slalJsonPath);
    const slalTxtSourseFilePath = path.resolve(path.dirname(slalJsonPath), `../source/${slalJsonName}.txt`);
    let content = ''

    try {
        content = await readFile(slalTxtSourseFilePath)
    } catch(e) {
        logger.warn(e.message)

        try {
            return await readObjectsFromBehavior(config, prefix)
        } catch(e) {
            logger.warn(e.message)
        }
    }
    
    const blocks: string[] = content.replace(/^#.*\n/gm, '').split('Animation(')
    const animations: Record<string, AnimObjects> = {}
    
    for(let i = 1; i < blocks.length; i++) {
        const idRegex = /id="([^"]+)"/
        const block = blocks[i]
        let [, blockId] = block.match(idRegex) || [];

        blockId = formatAnimName(blockId, prefix, author, idPrefix);
        const actorRegex = /actor(\d)=\w+(\([^)]+\))/g;
        const actorStagesRegex = /a(\d)_stage_params([^\]]+])/g
        const stageRegex = /Stage\((\d+),([\s\S]*?)\)/g;
        const objectRegex = /object="([^"]+)"/;
        const actorObjectMap: Record<string, AnimObjectsActor[]> = {};

        let actorMatch;

        while ((actorMatch = actorRegex.exec(block))) {
            const actor = Number(actorMatch[1]) - 1;
            const actorParams = actorMatch[2];
            
            if(objectRegex.test(actorParams)) {
                const [, objects] = actorParams.match(objectRegex) || [];
                const objectsArr = objects.split(' ')

                if(objectsArr.length) {
                    actorObjectMap[actor] = [{
                        stage: 'all',
                        objects: objectsArr,
                    }]
                }
                continue;
            }
        }

        let actorStagesMatch

        while((actorStagesMatch = actorStagesRegex.exec(block))) {
            const actor = Number(actorStagesMatch[1]) - 1;
            const stageParamsText = actorStagesMatch[2];

            if(actorObjectMap[actor]) {
                continue;
            }

            const stageMatches = [...stageParamsText.matchAll(stageRegex)];

            const stages = stageMatches.map(stageMatch => {
                const stageNumber = stageMatch[1];
                const objectMatch = stageMatch[2].match(objectRegex);
                const objectList = objectMatch ? objectMatch[1].split(' ') : [];

                if(objectList.length === 0) {
                    return null
                }
                
                return {
                    stage: Number(stageNumber),
                    objects: objectList
                };
            }).filter((stage) => !!stage) as AnimObjectsActor[];

            actorObjectMap[actor] = stages;
        }

        for(const [key, actorObject] of Object.entries(actorObjectMap)) {
            if(actorObject.length === 0) {
                delete actorObjectMap[key]
            }
        }

        if(Object.keys(actorObjectMap).length) {
            animations[blockId] = actorObjectMap
        }
    }

    return animations;
}
