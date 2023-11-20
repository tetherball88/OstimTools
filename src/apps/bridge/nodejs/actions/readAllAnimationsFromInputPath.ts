import fs from 'fs';
import path from 'path'
import { logger, isHkxFile, glob  } from '~common/nodejs/utils';
import { formatAnimName, parseSlalName } from "~bridge/nodejs/utils";
import { AnimationFromModule, CombinedConfig } from '~bridge/types';

export const readAllAnimationsFromInputPath = async (inputPath: string, prefix: string, author: string): Promise<AnimationFromModule | void> => {
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
        const name = formatAnimName(id, prefix, author);

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

export const readAllScenesFromOutputPath = async (config: CombinedConfig): Promise<string[]> => {
    const files = await glob(`${config.outputScenePath}\\**\\*.json`);

    return files.map(file => path.basename(file).replace(path.extname(file), ''))
}