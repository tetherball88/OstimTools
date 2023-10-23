import { writeJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModPositionsConfig } from "~explorer/types/ModsConfig"

export const writeModPositionsConfig = (modId: string, modPositionsConfig: ModPositionsConfig) => {
    return writeJson(`${getExplorerConfigPath()}\\mods\\${modId}\\positions.json`, modPositionsConfig)
}