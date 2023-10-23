import { readJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModPositionsConfig } from "~explorer/types/ModsConfig"

export const readModPositionsConfig = async (modId: string): Promise<ModPositionsConfig> => {
    try {
        return await readJson(`${getExplorerConfigPath()}\\mods\\${modId}\\positions.json`)
    } catch(e) {
        return []
    }
}
