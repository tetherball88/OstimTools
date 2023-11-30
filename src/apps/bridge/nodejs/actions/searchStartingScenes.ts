import { getActorsKeyword } from '~bridge/nodejs/utils';
import { StartingScene } from '~bridge/types/StartingScenes';
import { glob, logger, readJson } from '~common/nodejs/utils';
import { OstimScene } from '~common/shared/types/OstimScene';

export const searchStartingScenes = async (sourcePath: string) => {
    const files = await glob(`${sourcePath}\\**\\*.json`);
    const intros: StartingScene[] = []

    for (const file of files) {
        try {
            const content: OstimScene = await readJson(file);
            if(!content.tags?.includes('intro')) {
                continue;
            }
    
            intros.push({
                name: file.split('/').reverse()[0].replace('.json', ''),
                ...(content.furniture ? { furniture: content.furniture as any } : {}),
                actorsKeyword: getActorsKeyword(content.actors),
                length: content.length as any,
                speeds: content.speeds as any,
                actors: content.actors as any,
            })
        } catch(e) {
            logger.error(e.message)
        }
    }

    return intros;
}
