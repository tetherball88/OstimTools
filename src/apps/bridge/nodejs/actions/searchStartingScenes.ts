import { OstimScene } from '~bridge/types/OstimSAScene';
import { StartingScene } from '~bridge/types/StartingScenes';
import { glob, logger, readJson } from '~common/nodejs/utils';

export const searchStartingScenes = async (sourcePath: string) => {
    const files = await glob(`${sourcePath}\\**\\*.json`);
    const intros: StartingScene[] = []

    for (const file of files) {
        try {
            const content: OstimScene = await readJson(file);
            if(!content.tags?.includes('intro')) {
                continue;
            }
    
            const fCount = content.actors?.reduce((acc, { intendedSex }) => intendedSex === 'female' ? ++acc : acc, 0) || 0
            const mCount = content.actors?.reduce((acc, { intendedSex }) => intendedSex === 'male' ? ++acc : acc, 0) || 0
    
            intros.push({
                name: file.split('/').reverse()[0].replace('.json', ''),
                ...(content.furniture ? { furniture: content.furniture as any } : {}),
                actorsKeyword: 'f'.repeat(fCount) + 'm'.repeat(mCount),
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
