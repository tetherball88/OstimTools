import { formatAnimName, parseSlalName } from '~bridge/nodejs/utils';
import { glob, logger, readFile } from '~common/nodejs/utils';

export type SlalObjectsActor = { stage: number | 'all'; objects: string[] }
export type SlalObjects = Record<string, SlalObjectsActor[]>

export const readObjectsFromBehavior = async function (inputPath: string, prefix: string, author: string) {
    const behaviorTxtFile = (await glob(`${inputPath}/FNIS*.{txt,TXT}`))[0];
    let content = ''

    try {
        content = await readFile(behaviorTxtFile)
    } catch (e) {
        logger.warn(e.message)
    }

    const regex = /.*-o.*/g;
    const matches = content.match(regex);

    const res: Record<string, SlalObjects> = {}

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
            const formattedAnimName = formatAnimName(id, prefix, author);

            const animObjects = res[formattedAnimName] = res[formattedAnimName] || []
            const actorObjectMap = animObjects[actorIndex] = animObjects[actorIndex] || []

            actorObjectMap[stageIndex-1] = {
                stage: stageIndex,
                objects,
            }
        })
    }

    return res;
}
