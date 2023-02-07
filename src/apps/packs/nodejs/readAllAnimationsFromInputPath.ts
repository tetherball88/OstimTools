import fs from 'fs';
import { logger, isHkxFile  } from '~common/nodejs/utils';
import { formatAnimName, parseSlalName } from "~packs/nodejs/utils";
import { AnimationFromModule } from '~packs/types';

export const readAllAnimationsFromInputPath = async (inputPath: string, prefix: string): Promise<AnimationFromModule | void> => {
    const map: Record<string, { name: string, actors: Set<number>, stages: Set<number> }> = {};
    const files = await fs.promises.readdir(inputPath);

    for(const file of files) {
        if(!isHkxFile(file)) {
            continue;
        }
        const parsedSlalName = parseSlalName(file);

        if (!parsedSlalName) {
            logger.warn('Not a valid file name: ' + file);
            return;
        }
        const { id, actorIndex, stageIndex } = parsedSlalName;
        const name = formatAnimName(id, prefix);

        map[name] = map[name] || { name, actors: new Set, stages: new Set };
        map[name].actors.add(actorIndex);
        map[name].stages.add(stageIndex);
    }

    return Object.values(map).reduce<AnimationFromModule>((acc, val) => {
        return {
            ...acc,
            [val.name]: {
                name: val.name,
                actors: val.actors.size,
                stages: val.stages.size,
            }
        }
    }, {});
}