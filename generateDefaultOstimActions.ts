import { OstimScene } from './src/apps/bridge/types/OstimSAScene';
import {promisify} from 'util'
import globOriginal from 'glob'
import fs from 'fs'

const globPromisified = promisify(globOriginal);

export const glob = (pattern: string, options?: globOriginal.IOptions) => {
    return globPromisified(pattern.replace(/\\/g, '/'), options);
}

const ostimScenesPath = 'D:\\MO2\\mods\\OStim Standalone - Advanced Adult Animation Framework\\SKSE\\Plugins\\OStim\\scenes'

const call = async function() {
    const files = await glob(`${ostimScenesPath}\\**\\*.json`);
    const intros: any[] = []

    for (const file of files) {
        
        try {
            const content: OstimScene = await require(file);
            if(!content.tags?.includes('intro')) {
                continue;
            }
    
            const fCount = content.actors?.reduce((acc, { intendedSex }) => intendedSex === 'female' ? ++acc : acc, 0) || 0
            const mCount = content.actors?.reduce((acc, { intendedSex }) => intendedSex === 'male' ? ++acc : acc, 0) || 0
    
            intros.push({
                name: file.split('/').reverse()[0].replace('.json', ''),
                ...(content.furniture ? { furniture: content.furniture } : {}),
                actorsKeyword: 'f'.repeat(fCount) + 'm'.repeat(mCount),
                length: content.length,
                speeds: content.speeds,
                actors: content.actors,
            })
        } catch(e) {
            console.error(e)
        }
        
    }

    fs.writeFileSync('D:\\Tools\\_slal-to-ostim\\src\\apps\\bridge\\shared\\defaultOrigins.ts', `
import { DefaultOrigin } from "~bridge/shared/DefaultOrigin";

export const defaultOrigins: DefaultOrigin[] = ${JSON.stringify(intros, undefined, 4)}
    `)

    
}

call()
