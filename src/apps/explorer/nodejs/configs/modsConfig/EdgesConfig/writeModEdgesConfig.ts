import { writeJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModEdgesConfig } from "~explorer/types/ModsConfig"

export const writeModEdgesConfig = async (modId: string, modEdgesConfig: ModEdgesConfig) => {
    return await writeJson(`${getExplorerConfigPath()}\\mods\\${modId}\\edges.json`, modEdgesConfig)
}