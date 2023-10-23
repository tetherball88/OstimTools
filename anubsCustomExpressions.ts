import path from 'path'
import { OstimScene } from './src/common/shared/types/OstimScene';
import { copyFile, glob, readJson, writeJson } from "./src/common/nodejs/utils"

export function formatAnimName(name: string, prefix: string, author: string) {
    const nameParts = name.split('_');
    if(!nameParts[0].toLowerCase().startsWith(author.toLowerCase()))
        nameParts.unshift(author)
    return nameParts.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

const anubsCustomExpressions = async () => {
    const copyPath = 'D:\\MO2\\mods\\My anubs Human converstion\\host420Expressions\\SKSE\\Plugins\\OStim\\scenes'
    const oldAnubs = 'D:\\MO2\\mods\\Anubs Animation Ostim Standalone port\\SKSE\\Plugins\\OStim\\scenes'
    const newAnubs = 'D:\\MO2\\mods\\My anubs Human converstion\\SKSE\\Plugins\\OStim\\scenes'

    const oldFiles = await glob(`${oldAnubs}\\**\\*.json`);
    const newFiles = await glob(`${newAnubs}\\**\\*.json`);

    for(const oldFile of oldFiles) {
        const oldContent: OstimScene = await readJson(oldFile)
        
        if(!oldContent.actors?.some(actor => !!actor.expressionOverride)) {
            continue;
        }

        const newFile = newFiles.find(newFile => {
            return newFile.includes(formatAnimName(path.parse(oldFile).name, 'a_', 'Anubs'))
        })

        if(!newFile || newFile.includes('Agressive')) {
            continue;
        }

        const newContent: OstimScene = await readJson(newFile);

        oldContent.actors?.forEach((actor, index) => {
            const newActor = newContent.actors?.[index]
            if(actor.expressionOverride && newActor) {
                newActor.expressionOverride = actor.expressionOverride
            }
        })

        const copiedPath = path.normalize(newFile).replace(newAnubs, copyPath)

        console.log(path.normalize(newAnubs), copiedPath)

        await copyFile(newFile, copiedPath)

        await writeJson(copiedPath, newContent)
    }
}

anubsCustomExpressions()