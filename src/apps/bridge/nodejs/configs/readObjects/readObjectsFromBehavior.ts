import { AnimObjects } from '~bridge/nodejs/configs/readObjects/AnimObjects';
import { CombinedConfig } from '../../../types/CombinedConfig';
import { formatAnimName, parseSlalName } from '~bridge/nodejs/utils';
import { glob, logger, readFile } from '~common/nodejs/utils';

export const readObjectsFromBehavior = async function (config: CombinedConfig, prefix: string) {
    const {
        pack: {
            author
        },
        module: {
            inputPath,
            idPrefix = ""
        },
    } = config
    const behaviorTxtFile = (await glob(`${inputPath}/FNIS*.{txt,TXT}`))[0];
    let content = ''

    try {
        content = await readFile(behaviorTxtFile)
    } catch (e) {
        logger.warn(e.message)
    }

    const regex = /.*-o.*/g;
    const matches = content.match(regex);

    const res: Record<string, AnimObjects> = {}

    if (matches) {
        matches.forEach(line => {
            const lineSections = line.split(' ').reverse()
            let i = 0;
            const objects: string[] = []

            while (!lineSections[i].toLowerCase().includes('hkx')) {
                objects.push(lineSections[i])
                i++;
            }

            const fileName = lineSections[i];

            const parsedSlalName = parseSlalName(fileName);

            if (!parsedSlalName) {
                return
            }

            const { id, actorIndex, stageIndex } = parsedSlalName;
            const formattedAnimName = formatAnimName(id, prefix, author, idPrefix);

            if(!objects.length) {
                return
            }

            const animObjects = res[formattedAnimName] = res[formattedAnimName] || []
            const actorObjectMap = animObjects[actorIndex-1] = animObjects[actorIndex-1] || []

            actorObjectMap[stageIndex-1] = {
                stage: stageIndex,
                objects,
            }
        })
    }

    return res;
}
