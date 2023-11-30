import path from 'path'
import { OstimScene } from './src/common/shared/types/OstimScene';
import { glob, readJson, writeJson } from "./src/common/nodejs/utils"


const customExpressionScenesPath = "D:\\my-projects\\ostim packs\\Anub\\fomod\\host420Expressions\\SKSE\\Plugins\\OStim\\scenes"
const anubsScenesPath = "D:\\my-projects\\ostim packs\\Anub\\SKSE\\Plugins\\OStim\\scenes"  

const anubsCustomExpressions = async () => {
    const customExpressionsScenesFiles = await glob(`${customExpressionScenesPath}\\**\\*.json`)
    const anubsScenesFiles = await glob(`${anubsScenesPath}\\**\\*.json`)

    for(const customExpressionsFile of customExpressionsScenesFiles) {
        const fileName = path.basename(customExpressionsFile)
        const anubsFile = anubsScenesFiles.find(file => file.includes(fileName))

        if(!anubsFile) {
            console.error(`Couldn't find original file - ${fileName}`)
            continue;
        }

        const customContent = await readJson(customExpressionsFile) as OstimScene
        const anubsContent = await readJson(anubsFile) as OstimScene

        for(const [actorIndex, customActor] of (customContent.actors || []).entries()) {
            if(customActor.expressionOverride && anubsContent.actors?.[actorIndex]) {
                anubsContent.actors[actorIndex].expressionOverride = customActor.expressionOverride
            }
        }

        await writeJson(customExpressionsFile, anubsContent)
    }
}

anubsCustomExpressions()