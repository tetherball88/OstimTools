import path from 'path'
import { writeOstimConfig } from '~bridge/nodejs/configs/ostimConfig/writeOstimConfig'
import { renderSequence } from "~bridge/nodejs/renderScenes/renderSequence"
import { readAnnotations } from "~bridge/nodejs/utils"
import { CombinedConfig, OstimConfig, OstimConfigSequence } from "~bridge/types"
import { glob, logger } from "~common/nodejs/utils"

const ostimAnimFileRegex = /(.+)_(\d)_(\d)/
const parseOstimAnimFile = (filePath: string) => {
    const fileName = path.basename(filePath).replace(path.extname(filePath), '')
    const [, animName, stageIndex, actorIndex] = fileName.match(ostimAnimFileRegex) || []

    return { animName, stageIndex, actorIndex }
}

export const buildSequences = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log(`--- Started building sequences for ${config.module.name}`);
    const { outputAnimPath } = config
    const files = await glob(`${outputAnimPath}\\**\\*.hkx`)

    const visited: Record<string, boolean> = {}
    const sequences: Record<string, OstimConfigSequence> = {}

    animLoop: for(const file of files) {
        const { animName, stageIndex } = parseOstimAnimFile(file)
        const visitedKey = `${animName}-${stageIndex}`

        if(visited[visitedKey]) {
            continue
        }

        visited[visitedKey] = true
        const animConfig = ostimConfig[animName]
        
        const initialSequence = animConfig?.sequence

        if(initialSequence) {
            sequences[animName] = initialSequence
            continue animLoop
        }

        const duration = (await readAnnotations(file, config)).duration

        sequences[animName] = sequences[animName] || {
            scenes: [],
            tags: []
        }

        sequences[animName].scenes[Number(stageIndex) - 1] = {
            id: `${animName}-${stageIndex}`,
            duration,
        }
    }

    for(const [animName, sequence] of Object.entries(sequences)) {
        ostimConfig[animName] = ostimConfig[animName] || {}

        ostimConfig[animName].sequence = sequence
        await renderSequence(animName, sequence, config)
    }

    await writeOstimConfig(config, ostimConfig)

    logger.log(`--- Finished building sequences for ${config.module.name}`);
}