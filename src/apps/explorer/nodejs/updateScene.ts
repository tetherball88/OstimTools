import { logger, writeJson } from "~common/nodejs/utils"

export const updateScene = async (filePath: string, sceneStr: string) => {
    try {
        await writeJson(filePath, JSON.parse(sceneStr));
    } catch(e) {
        logger.error(`Could't save scene ${filePath}`)
        logger.error(e.message)
    }
}